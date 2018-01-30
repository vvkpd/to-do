const isOneOfHTML = function(url){
	return ["/home","/view"].includes(url);
};

const getFilePath = function(url){
	if(isOneOfHTML(url))
		url += ".html";
	return `./public/template/${url}`;
};

const getValidUser = function(registeredUser,user){
	return registeredUser.find((registerUser)=>
		registerUser.Name==user.Name && registerUser.Password==user.Password);
};

const getItems = function(items){
	if (!Array.isArray(items)) {
		let item = [];
		item.push(items);
		return item;
	}
	return items;
};

const writeUserName = function(username,fs,filePath){
	fs.writeFileSync(filePath,`var userName="${username}";`,"utf8");
	return ;
};

const setSessionAndRedirectTo = function(res,user,redirectPath){
	let sessionid = new Date().getTime();
	res.cookie("sessionid",`${sessionid}`);
	user.sessionid = sessionid;
	res.redirect(redirectPath);
};

const handleIfNotUser = function(res,redirectPath){
	res.cookie("logInFailed",true);
	res.redirect(redirectPath);
};

module.exports={
  getFilePath,
	getValidUser,
	getItems,
	setSessionAndRedirectTo,
	handleIfNotUser,
	writeUserName
}
