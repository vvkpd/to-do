const WebApp = require('./lib/webapp.js');
const lib = require('./lib/serverLib.js');
const fs = require('fs');
const PORT = 8000;

let app = WebApp.create();
app.use(lib.loadUser);
app.use(lib.redirectLoggedOutUserToLogin);
app.use(lib.redirectToLoggedInToHome);

app.get('/login.html',(req,res)=>{
  let html = fs.readFileSync('public/login.html','utf8');
  res.setHeader('Content-Type','text/html');
  res.write(html.replace('LOGIN_MESSAGE',req.cookies.message||''));
  res.end();
});

app.post('/todolist',lib.postTodoListHandler);
app.post('/login',lib.loginPageHandler);
app.get('/logout',lib.logoutPageHandler);

app.postProcess(lib.serveStaticPage);

module.exports = app;
