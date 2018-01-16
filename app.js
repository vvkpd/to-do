const WebApp = require('./lib/webapp.js');
const lib = require('./lib/serverLib.js');
const fs = require('fs');
const PORT = 8000;

let app = WebApp.create();
app.use(lib.loadUser);
app.use(lib.redirectLoggedOutUserToLogin);
app.use(lib.redirectToLoggedInToHome);


app.post('/login',lib.postLoginHandler);
app.get('/logout',lib.getLogoutHandler);

app.postProcess(lib.serveStaticPage);

module.exports = app;
