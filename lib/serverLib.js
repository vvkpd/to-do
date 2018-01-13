const fs = require('fs');
const qs = require('querystring');
const getContentType = require('./contentType.js').getContentType;
const registered_users = require('./registerUser.js').registered_users;
let database = fs.readFileSync('./data/database.json','utf8');
database = database && JSON.parse(database) || {};

const writeDataIntoDatabase = function(userData){
  fs.writeFileSync('./data/database.json',JSON.stringify(userData,null,2),'utf8');
  return ;
}

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

const handleIfNotUser = function(res,redirectPath){
  res.setHeader('Set-Cookie',`logInFailed=true`);
  res.redirect(redirectPath);
}

const addUser = function(name){
  database[name] = {};
  writeDataIntoDatabase(database);
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
const storeResponseAndRedirectTo = function(res,req,redirectPath) {
  let todoList = req.body;
  todoList.items = [];
  database[req.user.Name][req.body.title] = todoList;
  writeDataIntoDatabase(database);
  res.setHeader('Set-Cookie',`title=${req.body.title}`);
  res.redirect(redirectPath);
  return ;
}

const postTodoListHandler = function(req,res){
  storeResponseAndRedirectTo(res,req,'addtodoitems.html');
}

const getToDolist = function(req){
  return database[req.user.Name];
}

const setToDoItems = function(req,item){
  database[req.user.Name][req.cookies.title].items.push(item);
  return ;
}

const postToDoItemHandler = function(req,res){
  setToDoItems(req,req.body.todoitem);
  writeDataIntoDatabase(database);
  res.redirect('/addtodoitems.html');
  return ;
}

module.exports={
  loadUser,
  serveStaticPage,
  loginPageHandler,
  logoutPageHandler,
  redirectLoggedOutUserToLogin,
  redirectToLoggedInToHome,
  postTodoListHandler,
  getToDolist,
  postToDoItemHandler
}
