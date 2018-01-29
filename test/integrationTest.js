const request = require('supertest');
let app = require('../app.js');
let fs = require('fs');
app.fs = fs;
app.addData({"rahul": {
  "1": {
    "title": "play",
    "description": "sample file",
    "items": {
      "1": {
        "item": "play cricket",
        "status": false
      }
    }
  }
}});

let hasCookieWithName = function(name){
  return (res)=>{
    let cookies = res.headers['set-cookie'].join('');
    let result = cookies.includes(`${name}`);
    if(!result) throw new Error('expected cookie is not present');
  }
}

let hasCookieWithValue = function(name,value){
  return (res)=>{
    let cookies = res.headers['set-cookie'].join('');
    let result = cookies.includes(`${name}=${value}`);
    if(!result) throw new Error('expected cookie is not present');
  }
}

describe('app',()=>{
  let users=[{Name:'vivek', Password:'123'},
            {Name:'rahul', Password:'123', sessionid:'1234'}];
  app.injectUsers(users);
  describe('GET',()=>{
    describe('/bad',()=>{
      it('responds with 404',done=>{
        request(app)
          .get('/bad')
          .expect(404)
          .expect(/Cannot GET \/bad/)
          .end(done);
      })
    })

    describe('/',()=>{
      it('redirects to login',done=>{
        request(app)
          .get('/')
          .expect(302)
          .expect('Location','/login')
          .end(done);
      })

      it('redirects to home if user is already logged in',done=>{
        request(app)
          .get('/')
          .set('Cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/home')
          .end(done);
      })

      it('redirect user to login if sessionid is invalid',done=>{
        request(app)
          .get('/')
          .set('Cookie','sessionid=123')
          .expect(302)
          .expect('Location','/login')
          .end(done);
      })
    })

    describe('/login',()=>{
      it('serve the login page',done=>{
        request(app)
          .get('/login')
          .expect(200)
          .expect(/User-Name/)
          .end(done);
      })

      it('redirects to home if user is already logged in',done=>{
        request(app)
          .get('/login')
          .set('Cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/home')
          .end(done);
      })

      it('redirect user to login if sessionid is invalid',done=>{
        request(app)
          .get('/login')
          .set('Cookie','sessionid=123')
          .expect(200)
          .end(done);
      })
    })

    describe('/logout',()=>{
      it('redirects unlogged user to login',(done)=>{
        request(app)
          .get('/logout')
          .expect(302)
          .expect('Location','/login')
          .end(done);
      })

      it('reset cookies of logged in user',(done)=>{
        request(app)
          .get('/logout')
          .set('Cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/login')
          .expect('set-cookie','sessionid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT,logInFailed=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
          .end(done);
      })
    })

    describe('/home',()=>{
      it('should redirect unlogged user to login',(done)=>{
        request(app)
          .get('/home')
          .expect(302)
          .expect('Location','/login')
          .end(done)
      })

      it('should serve page for valid cookie',(done)=>{
        request(app)
          .get('/home')
          .set('Cookie','sessionid=1234')
          .expect(200)
          .expect(/Home/)
          .end(done);
      })

      it('should redirect to login for invalid cookies',(done)=>{
        request(app)
          .get('/home')
          .set('Cookie','sessionid=123')
          .expect(302)
          .expect('Location','/login')
          .end(done);
      })
    })

    describe('/addtodo',()=>{
      it('should redirect unlogged user to login',(done)=>{
        request(app)
          .get('/addtodo')
          .expect(302)
          .expect('Location','/login')
          .end(done)
      })

      it('should serve addTodo page for valid user',(done)=>{
        request(app)
          .get('/addtodo')
          .set('Cookie','sessionid=1234')
          .expect(200)
          .expect(/Add Todo:/)
          .end(done);
      })
    })

    describe('/view',()=>{
      it('should redirect to home if todoId is not present',done=>{
        request(app)
          .get('/view')
          .set('cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/home')
          .end(done);
      })

      it('should redirect invalid user to login',done=>{
        request(app)
          .get('/view')
          .expect(302)
          .expect('Location','/login')
          .end(done);
      })

      it('should view todo details to valid user of valid todoid',done=>{
        request(app)
          .get('/view')
          .set('cookie',['sessionid=1234','todoId=1'])
          .expect(200)
          .expect(/title/)
          .expect(/play/)
          .expect(/Description/)
          .expect(/items/)
          .end(done);
      })

      it('should redirect valid user to home for invalid todoid',done=>{
        request(app)
          .get('/view')
          .set('cookie',['sessionid=1234','todoId=3'])
          .expect(302)
          .expect('Location','/home')
          .end(done);
      })
    })
  })

  describe('POST',()=>{
    describe('/login',()=>{
      it('redirects to login with message for invalid user',done=>{
        request(app)
          .post('/login')
          .send('Name=badUser&Password=45')
          .expect(302)
          .expect('Location','/login')
          .expect(hasCookieWithValue('logInFailed',true))
          .end(done);
      })

      it('redirects valid user to home',done=>{
        request(app)
          .post('/login')
          .send('Name=vivek&Password=123')
          .expect(302)
          .expect('Location','/home')
          .expect(hasCookieWithName('sessionid'))
          .end(done);
      })
    })

    describe('/addTodo',()=>{
      it('should redirect unlogged user to login',(done)=>{
        request(app)
          .post('/addtodo')
          .expect(302)
          .expect('Location','/login')
          .end(done);
      })

      it('should redirect user to requested page if body is not present',done=>{
        request(app)
          .post('/addtodo')
          .set('cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/addtodo')
          .end(done);
      })

      it('should redirect user to home page if body is present without items',done=>{
        let getHome = function(){
          request(app)
            .get('/home')
            .set('cookie','sessionid=1234')
            .expect(200)
            .expect(/Home/)
            .expect(/sample/)
            .end(done);
        }
        request(app)
          .post('/addtodo')
          .set('cookie','sessionid=1234')
          .send('title=sample&description=file')
          .expect(302)
          .expect('Location','/home')
          .end(getHome);
      })

      it('should redirect user to home page if body is present with single item',done=>{
        let getHome = function(){
          request(app)
            .get('/home')
            .set('cookie','sessionid=1234')
            .expect(200)
            .expect(/Home/)
            .expect(/practice/)
            .end(done);
        }
        request(app)
          .post('/addtodo')
          .set('cookie','sessionid=1234')
          .send('title=practice&description=file&items=hello')
          .expect(302)
          .expect('Location','/home')
          .end(getHome);
      })

      it('should redirect user to home page if body is present with multiple item',done=>{
        let getHome = function(){
          request(app)
            .get('/home')
            .set('cookie','sessionid=1234')
            .expect(200)
            .expect(/Home/)
            .expect(/time/)
            .end(done);
        }
        request(app)
          .post('/addtodo')
          .set('cookie','sessionid=1234')
          .send('title=time&description=file&items=hello&items=hi')
          .expect(302)
          .expect('Location','/home')
          .end(getHome);
      })
    })
  })
});
