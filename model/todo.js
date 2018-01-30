const TodoItem = require("./todoitem.js");
class Todo {
	constructor(title,description) {
		this.title = title;
		this.description = description;
		this.items = {};
	}
	getTitle(){
		return this.title;
	}
	getDescription(){
		return this.description;
	}
	generateUniqID(){
		let itemId = Object.keys(this.items).reduce((pv,cv)=>Math.max(pv,cv),0);
		return ++itemId;
	}
	addItem(item){
		this.items[this.generateUniqID()] = new TodoItem(item);
	}
	addItems(items){
		items.forEach((item)=>this.addItem(item));
	}
	deleteItem(itemId){
		delete this.items[itemId];
	}
	getItems(){
		return this.items;
	}
	setUnDone(itemKey){
		this.items[itemKey].setUnDone();
		return this.items[itemKey].isDone();
	}
	setDone(itemKey){
		this.items[itemKey].setDone();
		return this.items[itemKey].isDone();
	}
	updateItem(itemKey,item){
		this.items[itemKey].update(item);
	}
}

module.exports = Todo;
