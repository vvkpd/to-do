const setDisable = function(){
	let inputBoxes = document.getElementsByTagName("input");
	[...inputBoxes].forEach((input)=>{
		input.disabled = true;
	});
	document.getElementById("additem").style = "visibility:hidden";
	document.querySelector("button[name='todoId']").style = "visibility:hidden";
};

const setEnable = function(){
	let inputBoxes = document.getElementsByTagName("input");
	[...inputBoxes].forEach((input)=>{
		input.disabled = false;
	});
	document.getElementById("additem").style = "visibility:visible";
	document.querySelector("button[name='todoId']").style = "visibility:visible";
};

window.onload = setDisable;
