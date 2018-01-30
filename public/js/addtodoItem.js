const generateInputBox = function(){
	let form = document.getElementById("addtodo");
	let inputBox = document.createElement("input");
	let brTag = document.createElement("br");
	inputBox.type = "text";
	inputBox.name = "items";
	form.appendChild(inputBox);
	form.appendChild(brTag);
	inputBox.focus();
};

window.onload = function(){
	let btn = document.getElementById("additem");
	btn.onclick = generateInputBox;
};
