const registered_users = require("./lib/registerUser.js").registered_users;
let http = require("http");
let app = require("./app.js");
const fs = require("fs");

app.fs = fs;

const loadDatabase = ()=>{
	let filePath = "./data/database.json";
	let data = fs.readFileSync(filePath,"utf8");
	return data && JSON.parse(data) || {};
};

app.addData(loadDatabase());
app.injectUsers(registered_users);

let server = http.createServer(app);
const PORT = 5000;
server.on("error",e=>console.error("**error**",e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
