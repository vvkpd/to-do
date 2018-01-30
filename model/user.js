const Todo = require("./todo.js");

class User {
	constructor(todos) {
		this.allTodo = todos;
	}

	getAllTodo(){
		return this.allTodo;
	}

	generateUniqID(){
		let todoId = Object.keys(this.allTodo).reduce((pv,cv)=>Math.max(pv,cv),0);
		return ++todoId;
	}

	addTodo(title,description,items){
		let todo = new Todo(title,description);
		todo.addItems(items);
		let id = this.generateUniqID();
		this.allTodo[id] = todo;
		return id;
	}

	deleteTodo(todoId){
		if(todoId in this.allTodo)
			return delete this.allTodo[todoId];
		return false;
	}

	getTodo(todoId){
		return this.allTodo[todoId];
	}

	updateTodo(todoId,title,description,items){
		let todo = new Todo(title,description);
		todo.addItems(items);
		this.allTodo[todoId] = todo;
	}
}
module.exports = User;
