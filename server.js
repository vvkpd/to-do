let http = require('http');
let app = require('./app.js');
const fs = require('fs');

app.fs = fs;

const loadDatabase = ()=>{
  let filePath = './data/database.json';
  let data = fs.readFileSync(filePath,'utf8');
  return data && JSON.parse(data) || {};
};

app.addData(loadDatabase());

let server = http.createServer(app);
const PORT = 5000;
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
