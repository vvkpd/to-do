let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js');
let th = require('./testHelper.js');

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
    it('redirects to login.html',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.should_be_redirected_to(res,'/login.html');
        assert.equal(res.body,"");
        done();
      })
    })
  })

  describe('GET /login.html',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/login.html'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'User-Name:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
})

describe('/login',()=>{
  let session;
  it('redirects to index for valid user',done=>{
    request(app,{method:'POST',url:'/login',body:'Name=vivek&Password=123'},res=>{
      th.should_be_redirected_to(res,'/index.html');
      th.should_not_have_cookie(res,'message');
      session = res.headers['Set-Cookie'];
    })
    done();
  })

  it('get /login.html=> should give index when req has valid cookie',done=>{
    request(app,{method:'GET',url:'/login.html',headers:{'cookie':`${session}`}},res=>{
      th.should_be_redirected_to(res,'/index.html');
      th.should_not_have_cookie(res,'logInFailed=true');
      done();
    })
  })

  it('get /login.html=> should give login when req has inValid cookie',done=>{
    request(app,{method:'GET',url:'/login.html',headers:{'cookie':`sessionid=134`}},res=>{
      th.status_is_ok(res);
      th.body_contains(res,'User-Name:')
      th.should_not_have_cookie(res,'logInFailed=true');
      done();
    })
  })

  it('redirects to login.html with message for invalid user',done=>{
    request(app,{method:'POST',url:'/login',body:'Name=badUser&Password=45'},res=>{
      th.should_be_redirected_to(res,'/login.html');
      th.should_have_expiring_cookie(res,'logInFailed=true');
      done();
    })
  })
})
