const fs = require('fs');
const qs = require('querystring');
const getContentType = require('./contentType.js').getContentType;
const registered_users = require('./registerUser.js').registered_users;


const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const redirectToLoggedInToHome= (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user)
    res.redirect('/home');
}

const redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/home']) && !req.user)
    res.redirect('/login');
}


const servePage = function(fileSystem,filePath,res){
  res.setHeader('Content-Type',`${getContentType(filePath)}`);
  res.write(fileSystem.readFileSync(filePath));
  res.end();
}

const isOneOfHTML = function(url){
  return ['/home','/login','/addtodolist','/addtodoitems'].includes(url);
}

const serveStaticPage = function(req,res){
  let url = req.url;
  if (isOneOfHTML(url))
    url += '.html';
  console.log(url);
  let filePath = './public'+url;
  if (fs.existsSync(filePath))
  servePage(fs,filePath,res);
}

const handleIfNotUser = function(res,redirectPath){
  res.setHeader('Set-Cookie',`logInFailed=true`);
  res.redirect(redirectPath);
}

const setSessionAndRedirectTo = function(res,user,redirectPath){
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect(redirectPath);
}

const getValidUser = function(registeredUser,user){
  return registeredUser.find((registerUser)=>
  registerUser.Name==user.Name && registerUser.Password==user.Password)
}

const postLoginHandler = function(req,res){
  let validUser = getValidUser(registered_users,req.body);
  if(!validUser) {
    handleIfNotUser(res,'/login');
    return;
  }
  setSessionAndRedirectTo(res,validUser,'/home');
  res.end();
}

const getLogoutHandler = function(req,res) {
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
}


module.exports={
  loadUser,
  serveStaticPage,
  postLoginHandler,
  getLogoutHandler,
  redirectLoggedOutUserToLogin,
  redirectToLoggedInToHome,
}
