const fs = require('fs');
const qs = require('querystring');
const getContentType = require('./contentType.js').getContentType;
const registered_users = require('./registerUser.js').registered_users;
const database = JSON.parse(fs.readFileSync('./data/database.json','utf8') || {});


const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const redirectToLoggedInToHome= (req,res)=>{
  if(req.urlIsOneOf(['/','/login.html']) && req.user) res.redirect('/index.html');
}

const redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/index.html']) && !req.user)
    res.redirect('/login.html');
}

const servePage = function(fileSystem,filePath,res){
  res.setHeader('Content-Type',`${getContentType(filePath)}`);
  res.write(fileSystem.readFileSync(filePath));
  res.end();
}


const serveStaticPage = function(req,res){
  let filePath = './public'+req.url;
  if (fs.existsSync(filePath))
  servePage(fs,filePath,res);
}

const handleGuestBookPage = function(req,res){
  if (!req.user){
    res.redirect('guest.html');
    return ;
  }
}

const handleIfNotUser = function(res,redirectPath){
  res.setHeader('Set-Cookie',`logInFailed=true`);
  res.redirect(redirectPath);
}

const addUser = function(name){
  database[name] = {};
  console.log(JSON.stringify(database));
  fs.writeFileSync('./data/database.json',JSON.stringify(database),'utf8');
  return ;
}

const setSessionAndRedirectTo = function(res,user,redirectPath){
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  addUser(user.Name);
  res.redirect(redirectPath);
}

const getValidUser = function(registeredUser,user){
  return registeredUser.find((registerUser)=>
  registerUser.Name==user.Name && registerUser.Password==user.Password)
}

const loginPageHandler = function(req,res){
  let validUser = getValidUser(registered_users,req.body);
  if(!validUser) {
    handleIfNotUser(res,'/login.html');
    return;
  }
  setSessionAndRedirectTo(res,validUser,'/index.html');
  res.end();
}

const logoutPageHandler = function(req,res) {
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login.html');
}
const storeResponseAndRedirectTo = function(res,content,redirectPath) {
  
}

const postTodoListHandler = function(){
  storeResponseAndRedirectTo(res,req.body,'index.html');
}

module.exports={
  loadUser,
  serveStaticPage,
  handleGuestBookPage,
  loginPageHandler,
  logoutPageHandler,
  redirectLoggedOutUserToLogin,
  redirectToLoggedInToHome,
  postTodoListHandler
}
