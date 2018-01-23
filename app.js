const WebApp = require('./lib/webapp.js');
const handler = require('./lib/handlers.js');
const PORT = 8000;
const todoApp = require('./model/users.js');

let app = WebApp.create();

app.addData = (data)=>{
  app.users = new todoApp(data);
}

app.use(handler.logRequest.bind(app));
app.use(handler.loadUser.bind(app));
app.use(handler.authentication);
app.use(handler.redirectLoggedInUserToHome);

app.get('/home',handler.getHome.bind(app));
app.post('/login',handler.postLoginHandler.bind(app));
app.post('/addtodo',handler.postTodo);
app.post('/deletetodo',handler.deletetodo);
app.post('/updateTodo',handler.updateTodo);
app.post('/viewtodo',handler.viewtodo);
app.get('/view',handler.serveTodo.bind(app));
app.get('/logout',handler.getLogoutHandler);

app.postProcess(handler.writeInDatabase.bind(app));
app.postProcess(handler.serveStaticPage.bind(app));

module.exports = app;
