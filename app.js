const WebApp = require('./lib/webapp.js');
const handler = require('./lib/handlers.js');
const PORT = 8000;

let app = WebApp.create();
handler.loadDatabase();

app.use(handler.logRequest);
app.use(handler.loadUser);
app.use(handler.authentication);
app.use(handler.redirectLoggedInUserToHome);

app.get('/home',handler.getHome);
app.post('/login',handler.postLoginHandler);
app.post('/addtodo',handler.postTodo);
app.post('/deletetodo',handler.deletetodo);
app.post('/updateTodo',handler.updateTodo);
app.post('/viewtodo',handler.viewtodo);
app.get('/view',handler.serveTodo);
app.get('/logout',handler.getLogoutHandler);

app.postProcess(handler.writeInDatabase);
app.postProcess(handler.serveStaticPage);

module.exports = app;
