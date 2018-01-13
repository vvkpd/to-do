class User {
  constructor() {
    this.allTodo = {};
  }

  getAllTodo(){
    return this.allTodo;
  }

  addTodo(todo){
    this.allTodo[todo.title] = todo;
  }

  deleteTodo(todo){
    delete this.allTodo[todo];
  }
}
module.exports = User;
