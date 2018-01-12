const WebApp = require('./lib/webapp.js');
const lib = require('./lib/serverLib.js');
const PORT = 8000;

let app = WebApp.create();

app.get('/',(req,res)=>{
  res.redirect('/login.html');
});

app.post('/login',lib.loginPageHandler);
app.postProcess(lib.serveStaticPage);

module.exports = app;
