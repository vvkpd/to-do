const WebApp = require('./lib/webapp.js');
const lib = require('./lib/serverLib.js');
const PORT = 8000;

let app = WebApp.create();
app.use(lib.loadUser);
app.use(lib.redirectLoggedOutUserToLogin);
app.use(lib.redirectToLoggedInToHome);
app.get('/',(req,res)=>{
  res.redirect('/login.html');
});
app.post('/login',lib.loginPageHandler);
app.get('/logout',lib.logoutPageHandler);

app.postProcess(lib.serveStaticPage);

module.exports = app;
