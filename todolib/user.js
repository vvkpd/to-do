class User {
  constructor() {
    this.allTodo = {};
    this.todoKey = 0;
  }

  get getAllTodo(){
    return this.allTodo;
  }

  addTodo(todo){
    this.allTodo[this.todoKey] = todo;
  }

  deleteTodo(todoKey){
    delete this.allTodo[todoKey];
  }
}
module.exports = User;
