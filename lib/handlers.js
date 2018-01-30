const Html = require("./toHtml.js");
const util = require('./handlerUtils.js');

const logRequest = function(req,res,next){
	let text = ["------------------------------",
		`${new Date().toLocaleString()}`,
		`${req.method} ${req.url}`,
		`HEADERS=> ${JSON.stringify(req.headers,null,2)}`,
		`COOKIES=> ${JSON.stringify(req.cookies,null,2)}`,
		`BODY=> ${JSON.stringify(req.body,null,2)}`,""].join("\n");
	this.fs.appendFileSync("./request.log",text);
	next();
};

const loadUser = function(req,res,next){
	let sessionid = req.cookies.sessionid;
	let user = this.users.find(u=>u.sessionid==sessionid);
	if(sessionid && user){
		req.user = user;
	}
	next();
};

const redirectLoggedInUserToHome = (req,res,next)=>{
	if(["/","/login"].includes(req.url) && req.user)
		res.redirect("/home");
	else next();
};

const authentication = (req,res,next)=>{
	let urls = ["/home","/addtodo","/logout","/","/deletetodo","/view","/updateTodo","/viewtodo"];
	if(urls.includes(req.url) && !req.user)
		res.redirect("/login");
	else next();
};

const postLoginHandler = function(req,res){
	let validUser = util.getValidUser(this.users,req.body);
	if(!validUser) {
		util.handleIfNotUser(res,"/login");
		return;
	}
	util.writeUserName(validUser.Name,this.fs,"./public/js/username.js")
	util.setSessionAndRedirectTo(res,validUser,"/home");
};

const getLogoutHandler = function(req,res) {
	res.clearCookie("sessionid");
	res.clearCookie("logInFailed");
	res.redirect("/login");
};

const writeInDatabase = function(req,res,next){
	if (req.user) {
		let database = this.todoapp.getUsers();
		let filePath = process.env.FILE || "./data/database.json";
		this.fs.writeFileSync(filePath,JSON.stringify(database,null,2),"utf8");
	}
	next();
};

const postTodo = function(req,res){
	let userInput = req.body;
	if (!userInput.title && !userInput.description) {
		res.redirect("/addtodo");
		return;
	}
	let items = userInput.items && util.getItems(userInput.items) || [];
	let userAgent = this.todoapp.createUser(req.user.Name);
	userAgent.addTodo(userInput.title,userInput.description,items);
	res.redirect("/home");
};

const getHome = function(req,res){
	let filePath = util.getFilePath(req.url);
	let home = this.fs.readFileSync(filePath,"utf8");
	let userData = this.todoapp.getUserData(req.user.Name);
	home = home.replace("todolist",`${new Html(userData).generateHomeContent()}`);
	res.send(home);
};

const deletetodo = function(req,res){
	let userAgent = this.todoapp.createUser(req.user.Name);
	userAgent.deleteTodo(req.body.todoId);
	res.redirect("/home");
};

const viewtodo = function(req,res){
	res.cookie("todoId",`${req.body.todoId}`);
	res.redirect("/view");
};

const serveTodo = function(req,res){
	let todoId = req.cookies.todoId;
	let userAgent = this.todoapp.createUser(req.user.Name);
	let todoDetails = userAgent.getTodo(todoId);
	res.clearCookie("todoId");
	if(!todoId || !todoDetails){
		res.redirect("/home");
		return ;
	}
	todoDetails.todoId = todoId;
	let viewContent = this.fs.readFileSync(util.getFilePath(req.url),"utf8");
	let replacer=new Html(todoDetails).generateViewContent();
	res.send(viewContent.replace("viewtodo",replacer));
};

const updateTodo = function(req,res){
	let input = req.body;
	let items = input.items && util.getItems(input.items) || [];
	let userAgent = this.todoapp.createUser(req.user.Name);
	userAgent.updateTodo(input.todoId,input.title,input.description,items);
	res.redirect("/home");
};

module.exports={
	logRequest,
	loadUser,
	postLoginHandler,
	getLogoutHandler,
	authentication,
	redirectLoggedInUserToHome,
	writeInDatabase,
	postTodo,
	getHome,
	deletetodo,
	viewtodo,
	serveTodo,
	updateTodo
};
