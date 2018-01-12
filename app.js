const WebApp = require('./lib/webapp.js');
const lib = require('./lib/serverLib.js');
const PORT = 8000;

let app = WebApp.create();


// app.use(lib.loadUsers);
// app.get('/guestbook.html',lib.handleGuestBookPage);
app.get('/',(req,res)=>{
  res.redirect('/login.html');
});

app.postProcess(lib.serveStaticPage);

module.exports = app;
