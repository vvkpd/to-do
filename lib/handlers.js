const fs = require('fs');
const qs = require('querystring');
const getContentType = require('./contentType.js').getContentType;
const registered_users = require('./registerUser.js').registered_users;
const Users = require('../model/users.js');
const Html = require('./toHtml.js');
let users;


const logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${new Date().toLocaleString()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${JSON.stringify(req.headers,null,2)}`,
    `COOKIES=> ${JSON.stringify(req.cookies,null,2)}`,
    `BODY=> ${JSON.stringify(req.body,null,2)}`,''].join('\n');
  fs.appendFile('./request.log',text,()=>{});
}

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
    req.userAgent = users.createUser(user.Name);
  }
};

const loadDatabase = function(){
  let filePath = process.env.FILE || './data/database.json';
  fs.readFile(filePath,'utf8',(err,data)=>{
    if(err) data='';
    let database = data && JSON.parse(data) || {};
    users = new Users(database);
  });
};

const redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user)
    res.redirect('/home');
};

const authentication = (req,res)=>{
  if(req.urlIsOneOf(['/home','/addtodo','/logout','/']) && !req.user)
    res.redirect('/login');
}

const servePage = function(fileSystem,filePath,res){
  res.setHeader('Content-Type',`${getContentType(filePath)}`);
  res.write(fileSystem.readFileSync(filePath));
  res.end();
}

const isOneOfHTML = function(url){
  return ['/home','/login','/addtodo','/view'].includes(url);
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
  let sessionid = process.env.SESSION_ID || new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  writeUserName(user.Name);
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
  let message = `loginFailed=false; Expires=${new Date(1).toUTCString()}`;
  let sessionId = `sessionid=0; Expires=${new Date(1).toUTCString()}`
  res.setHeader('Set-Cookie',[message,sessionId]);
  delete req.user.sessionid;
  delete req.userAgent;
  res.redirect('/login');
}

/*-------------------------------------------------*/
const writeInDatabase = function(req,res){
  if (req.user) {
    let database = users.getUsers();
    let filePath = process.env.FILE || './data/database.json';
    fs.writeFileSync(filePath,JSON.stringify(database,null,2),'utf8');
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
  if (!userInput.title && !userInput.description) {
    res.redirect('/addtodo');
    return;
  }
  let items = userInput.items && getItems(userInput.items) || [];
  req.userAgent.addTodo(userInput.title,userInput.description,items)
  res.redirect('/home');
}

const getHome = function(req,res){
  let filePath = getFilePath(req.url);
  let home = fs.readFileSync(filePath,'utf8');
  let userData = users.getUserData(req.user.Name);
  home = home.replace('todolist',`${new Html(userData).generateHomeContent()}`);
  res.write(home);
  res.end();
}

const deletetodo = function(req,res){
  req.userAgent.deleteTodo(req.body.todoId);
  res.redirect('/home');
}

const viewtodo = function(req,res){
  res.setHeader('Set-Cookie',`todoId=${req.body.todoId}`);
  res.redirect('/view');
}

const serveTodo = function(req,res){
  let todoId = req.cookies.todoId;
  if(!todoId){
    res.redirect('/home');
    return ;
  }
  let todoDetails = req.userAgent.getTodo(todoId);
  todoDetails.todoId = todoId;
  res.setHeader('Set-Cookie',`todoId=0; Expires=${new Date(1).toUTCString()}`);
  let viewContent = fs.readFileSync('./public/view.html','utf8');
  let replacer=new Html(todoDetails).generateViewContent();
  res.write(viewContent.replace('viewtodo',replacer));
  res.end();
}

const updateTodo = function(req,res){
  let input = req.body;
  if (!input.title && !input.description) {
    res.redirect('/addtodo');
    return;
  }
  let items = input.items && getItems(input.items) || [];
  req.userAgent.updateTodo(input.todoId,input.title,input.description,items)
  res.redirect('/home');
}

module.exports={
  logRequest,
  loadUser,
  serveStaticPage,
  postLoginHandler,
  getLogoutHandler,
  loadDatabase,
  authentication,
  redirectLoggedInUserToHome,
  writeInDatabase,
  postTodo,
  getHome,
  deletetodo,
  viewtodo,
  serveTodo,
  updateTodo
}
