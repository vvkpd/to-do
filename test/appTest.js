let assert = require('chai').assert;
const fs = require('fs');
let request = require('./requestSimulator.js');
process.env.FILE = './testData.json';
let app = require('../app.js');
let th = require('./testHelper.js');
process.env.SESSION_ID = 1234;
app.fs = fs;
app.addData({});

describe('app',()=>{
  describe('GET',()=>{
    describe('/bad',()=>{
      it('responds with 404',done=>{
        request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
        })
      })
    })

    describe('GET /',()=>{
      it('redirects to login',done=>{
        request(app,{method:'GET',url:'/'},(res)=>{
          th.should_be_redirected_to(res,'/login');
          done();
        })
      })

      it('redirects to home if user is already logged in',done=>{
        request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{});
        request(app,{method:'GET',url:'/',headers:{'cookie':`sessionid=1234`}},(res)=>{
          th.should_be_redirected_to(res,'/home');
          done();
        })
        request(app,{method:'GET',url:'/logout'},res=>{});
      })
    })

    describe('GET /login',()=>{
      it('serves the login page',done=>{
        request(app,{method:'GET',url:'/login'},res=>{
          th.status_is_ok(res);
          th.body_contains(res,'User-Name:');
          th.body_does_not_contain(res,'login failed');
          th.should_not_have_cookie(res,'message');
          done();
        })
      })
    })

    describe('GET /login with user',()=>{
      before(function(){
        request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{});
      });

      after(()=>{
        request(app,{method:'GET',url:'/logout'},res=>{})
      });

      it('redirects to index for valid user',done=>{
        request(app,{method:'GET',url:'/login',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`}},res=>{
          th.should_be_redirected_to(res,'/home');
          th.should_not_have_cookie(res,'message');
        })
        done();
      })

      it('get /login=> should give index when req has valid cookie',done=>{
        request(app,{method:'GET',url:'/login',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`}},res=>{
          th.should_be_redirected_to(res,'/home');
          th.should_not_have_cookie(res,'logInFailed=true');
        })
        done();
      })

      it('should give login when req has inValid cookie',done=>{
        request(app,{method:'GET',url:'/login',headers:{'cookie':`sessionid=134`}},res=>{
          th.status_is_ok(res);
          th.body_contains(res,'User-Name:')
          th.should_not_have_cookie(res,'logInFailed=true');
          done();
        })
      })
    })

    describe('GET /logout',()=>{
      it('redirects unlogged user to login',(done)=>{
        request(app,{method:'GET',url:'/logout'},(res)=>{
          th.should_be_redirected_to(res,'/login');
          th.body_contains(res,'');
          done();
        })
      })

      it('reset cookies of logged in user',(done)=>{
        request(app,{method:'GET',url:'/logout',headers:{'cookie':`sessionid=1234`}},(res)=>{
          th.should_be_redirected_to(res,'/login');
          th.should_have_expiring_cookie(res,"loginFailed=false; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
          th.should_have_expiring_cookie(res,'sessionid=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
          done();
        })
      })
    })

    describe('GET /home without loggedin',()=>{
      it('should redirect unlogged user to login',(done)=>{
        request(app,{method:'GET',url:'/home'},(res)=>{
          th.should_be_redirected_to(res,'/login');
          done();
        })
      })

    })

    describe('GET /home with loggedin',()=>{
      before(()=>{
        request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{});
      });

      after(()=>{
        request(app,{method:'GET',url:'/logout'},res=>{})
      });

      it('should serve page for valid cookie',(done)=>{
        request(app,{method:'GET',url:'/home',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`}},(res)=>{
          th.status_is_ok(res);
          th.body_contains(res,"Home");
          done();
        })
      })

      it('should redirect to login for invalid cookies',(done)=>{
        request(app,{method:'GET',url:'/home',headers:{'cookie':`sessionid=123`}},(res)=>{
          th.should_be_redirected_to(res,'/login');
          done();
        })
      })
    })

    describe('GET /addtodo',()=>{
      it('should redirect unlogged user to login',(done)=>{
        request(app,{method:'GET',url:'/addtodo'},(res)=>{
          th.should_be_redirected_to(res,'/login');
          done();
        })
      })

      it('should serve addTodo page for valid user',(done)=>{
        request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{});
        request(app,{method:'GET',url:'/addtodo',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`}},(res)=>{
          th.status_is_ok(res);
          th.body_contains(res,"Add Todo:");
          done();
        })
        request(app,{method:'GET',url:'/logout'},res=>{});
      })
    })
  })

  describe('POST',()=>{
    describe('POST /login',()=>{
      it('redirects to login with message for invalid user',done=>{
        request(app,{method:'POST',url:'/login',body:'Name=badUser&Password=45'},res=>{
          th.should_be_redirected_to(res,'/login');
          th.should_have_expiring_cookie(res,'logInFailed=true');
          done();
        })
      })
    })

    describe('POST /addTodo without user',()=>{
      it('should redirect unlogged user to login',(done)=>{
        request(app,{method:'POST',url:'/addtodo'},(res)=>{
          th.should_be_redirected_to(res,'/login');
          done();
        })
      })
    })

    describe('POST /addtodo with user',()=>{
      before(function(){
        request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{});
      });

      after(()=>{
        request(app,{method:'GET',url:'/logout'},res=>{})
      });

      it('should redirect user to requested page if body is not present',done=>{
        request(app,{method:'POST',url:'/addtodo',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`}},(res)=>{
          th.should_be_redirected_to(res,'/addtodo');
          done();
        })
      })

      it('should redirect user to home page if body is present without items',
      done=>{
        request(app,{method:'POST',url:'/addtodo',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`},body:'title=1&description=11'},(res)=>{
          th.should_be_redirected_to(res,'/home');
          done();
        })
      })

      it('should redirect user to home page if body is present with single item',done=>{
        request(app,{method:'POST',url:'/addtodo',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`},body:'title=1&description=11&items=hello'},
        (res)=>{
          th.should_be_redirected_to(res,'/home');
          done();
        })
      })

      it('should redirect user to home page if body is present with multiple item',done=>{
        request(app,{method:'POST',url:'/addtodo',headers:{'cookie':`sessionid=${process.env.SESSION_ID}`},body:'title=1&description=11&items=hi&items=12'},
        (res)=>{
          th.should_be_redirected_to(res,'/home');
          done();
        })
      })
    })
  })
});
