const http = require('http');
const WebApp = require('./lib/webapp.js');
const lib = require('./lib/serverLib.js');
const PORT = 8000;

let app = WebApp.create();

app.get('/',(req,res)=>{
  console.log('aaayya');
  res.redirect('/login.html');
})

app.postProcess(lib.serveStaticPage);

let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
