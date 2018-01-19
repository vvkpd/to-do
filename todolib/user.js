const Todo = require('./todo.js');

class User {
  constructor(todos) {
    this.allTodo = todos;
    this.todoId = Object.keys(todos).length;
  }

  getAllTodo(){
    return this.allTodo;
  }

  addTodo(title,description,items){
    let todo = new Todo(title,description);
    todo.addItems(items);
    this.allTodo[this.todoId] = todo;
    this.todoId++;
  }

  deleteTodo(todoId){
    delete this.allTodo[todoId];
  }
}
module.exports = User;
