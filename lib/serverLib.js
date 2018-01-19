const fs = require('fs');
const qs = require('querystring');
const getContentType = require('./contentType.js').getContentType;
const registered_users = require('./registerUser.js').registered_users;
const DbHandler = require('../todolib/databaseHandler.js');
let dbHandler;

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const loadDatabase = function(){
  let users = fs.readFileSync('./data/database.json','utf8');
  let database = users && JSON.parse(users) || {};
  dbHandler = new DbHandler(database);
};

const redirectLoggedUserToHome = (req,res)=>{
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

const getFilePath = function(url){
  if (isOneOfHTML(url))
    url += '.html';
  return `./public${url}`;
}

const serveStaticPage = function(req,res){
  let filePath = getFilePath(req.url);
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
  dbHandler.addUser(user.Name);
  res.redirect(redirectPath);
}

const getValidUser = function(registeredUser,user){
  return registeredUser.find((registerUser)=>
  registerUser.Name==user.Name && registerUser.Password==user.Password);
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
  let message = `loginFailed=false,Expires=${new Date(1).toUTCString()}`;
  let sessionId = `sessionid=0,Expires=${new Date(1).toUTCString()}`
  res.setHeader('Set-Cookie',[message,sessionId]);
  delete req.user.sessionid;
  res.redirect('/login');
}

/*-------------------------------------------------*/
const writeInDatabase = function(req,res){
  if (req.user) {
    let database = dbHandler.getDatabase();
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
  let userInput = req.body;
  let items = userInput.items && getItems(userInput.items) || [];
  dbHandler.addTodo(req.user.Name,userInput.title,userInput.description,items)
  res.redirect('/home');
}

const createButtonTag = function(btnId,btnText){
  return `<button name="todoId" value="${btnId}" type="submit"">${btnText}</button>`;
}

const createFormTag = function(action,method,innerElements){
  return `<form action="${action}" method="${method}">${innerElements}</form>`;
}

const toHtml = function(userData){
  let todoId = Object.keys(userData);
  let contents = "";
  todoId.forEach((id)=>{
    contents += `${userData[id]["title"]} ${createFormTag('/deletetodo','POST',createButtonTag(id,'delete'))}<br/>`
  })
  return contents;
}

const getHome = function(req,res){
  let filePath = getFilePath(req.url);
  let home = fs.readFileSync(filePath,'utf8');
  let userData = dbHandler.getUserData(req.user.Name);
  home = home.replace('todolist',`${toHtml(userData)}`);
  res.write(home);
  res.end();
}

const deletetodo = function(req,res){
  dbHandler.deleteTodo(req.user.Name,req.body.todoId);
  res.redirect('/home');
}

module.exports={
  loadUser,
  serveStaticPage,
  postLoginHandler,
  getLogoutHandler,
  loadDatabase,
  redirectLoggedOutUserToLogin,
  redirectLoggedUserToHome,
  writeInDatabase,
  postTodo,
  getHome,
  deletetodo
}
