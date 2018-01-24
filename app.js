const handler = require('./lib/handlers.js');
const todoApp = require('./model/users.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = 8000;
let app = express();

app.addData = (data)=>{
  app.todoapp = new todoApp(data);
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(handler.logRequest.bind(app));
app.use(handler.loadUser.bind(app));
app.use(handler.authentication);
app.use(express.static('public',{extensions:['html','htm']}));
app.post('/login',handler.postLoginHandler.bind(app));
app.use(handler.redirectLoggedInUserToHome);

app.use(handler.writeInDatabase.bind(app));
app.get('/home',handler.getHome.bind(app));
app.post('/addtodo',handler.postTodo.bind(app));
app.post('/deletetodo',handler.deletetodo.bind(app));
app.post('/updateTodo',handler.updateTodo.bind(app));
app.post('/viewtodo',handler.viewtodo);
app.get('/view',handler.serveTodo.bind(app));
app.get('/logout',handler.getLogoutHandler);



module.exports = app;
