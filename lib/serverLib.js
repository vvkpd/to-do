const fs = require('fs');
const qs = require('querystring');
const getContentType = require('./contentType.js').getContentType;
const registered_users = require('./registerUser.js').registered_users;
const User = require('../todolib/user.js');
let database;

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
    req.userData = (req.user.Name in database)?database[req.user.Name]:{};
  }
};

const loadDatabase = function(){
  let users = fs.readFileSync('./data/database.json','utf8');
  database = users && JSON.parse(users) || {};
};

const redirectToLoggedInToHome= (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user)
    res.redirect('/home');
};

const redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/home','/addtodo']) && !req.user)
    res.redirect('/login');
}


const servePage = function(fileSystem,filePath,res){
  res.setHeader('Content-Type',`${getContentType(filePath)}`);
  res.write(fileSystem.readFileSync(filePath));
  res.end();
}

const isOneOfHTML = function(url){
  return ['/home','/login','/addtodo'].includes(url);
}

const serveStaticPage = function(req,res){
  let url = req.url;
  if (isOneOfHTML(url))
    url += '.html';
  let filePath = './public'+url;
  if (fs.existsSync(filePath))
  servePage(fs,filePath,res);
}

const handleIfNotUser = function(res,redirectPath){
  res.setHeader('Set-Cookie',`logInFailed=true`);
  res.redirect(redirectPath);
}

const writeUserName = function(username){
  fs.writeFileSync('./public/js/username.js',`var userName="${username}";`,'utf8');
  return ;
}

const setSessionAndRedirectTo = function(res,user,redirectPath){
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  writeUserName(user.Name);
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
  delete req.userData;
  res.redirect('/login');
}

/*-------------------------------------------------*/
const writeInDatabase = function(req,res){
  if (req.user) {
    database[req.user.Name] = req.userData;
    fs.writeFileSync('./data/database.json',JSON.stringify(database,null,2),'utf8');
  }
}

const getItems = function(items){
  if (!Array.isArray(items)) {
    let item = [];
    item.push(items);
    return item;
  }
  return items;
}

const postTodo = function(req,res){
  let user = new User(req.userData);
  let items = req.body.items && getItems(req.body.items) || [];
  user.addTodo(req.body.title,req.body.description,items);
  req.userData = user.getAllTodo();
  res.redirect('/home');
}


module.exports={
  loadUser,
  serveStaticPage,
  postLoginHandler,
  getLogoutHandler,
  loadDatabase,
  redirectLoggedOutUserToLogin,
  redirectToLoggedInToHome,
  writeInDatabase,
  postTodo
}
