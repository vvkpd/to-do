 let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js');
let th = require('./testHelper.js');
process.env.SESSION_ID = 1234;

describe('app',()=>{
  describe('GET /bad',()=>{
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
      request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{})
      request(app,{method:'GET',url:'/',headers:{'cookie':`sessionid=1234`}},(res)=>{
        th.should_be_redirected_to(res,'/home');
        done();
      })
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

    it('redirects to index for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{
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

    it('get /login=> should give login when req has inValid cookie',done=>{
      request(app,{method:'GET',url:'/login',headers:{'cookie':`sessionid=134`}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'User-Name:')
        th.should_not_have_cookie(res,'logInFailed=true');
        done();
      })
    })

    it('redirects to login with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'Name=badUser&Password=45'},res=>{
        th.should_be_redirected_to(res,'/login');
        th.should_have_expiring_cookie(res,'logInFailed=true');
        done();
      })
    })
  })

  describe('GET /logout',()=>{
    it('redirects unlogged user to login',(done)=>{
      request(app,{method:'GET',url:'/logout'},(res)=>{
        th.should_be_redirected_to(res,'/login');
        assert.equal(res.body,"");
        done();
      })
    })

    it('reset cookies of logged in user',(done)=>{
      request(app,{method:'GET',url:'/logout',headers:{'cookie':`sessionid=123`}},(res)=>{
        th.should_be_redirected_to(res,'/login');
        th.should_not_have_cookie(res,"sessionid");
        assert.equal(res.body,"");
        done();
      })
    })
  })

  describe('GET /home',()=>{
    it('should redirect unlogged user to login',(done)=>{
      request(app,{method:'GET',url:'/home'},(res)=>{
        th.should_be_redirected_to(res,'/login');
        done();
      })
    })

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

  })
})
