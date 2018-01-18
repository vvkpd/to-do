const Todo = require('./todo.js');

class User {
  constructor(todo) {
    this.allTodo = todo;
    this.todoKey = Object.keys(todo).length;
  }

  getAllTodo(){
    return this.allTodo;
  }

  addTodo(title,description,items){
    let todo = new Todo(title,description);
    todo.addItems(items);
    this.allTodo[this.todoKey] = todo;
    this.todoKey++;
  }

  deleteTodo(todoKey){
    delete this.allTodo[todoKey];
  }
}
module.exports = User;
