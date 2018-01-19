const User = require('./user.js');
class DatabaseHandler {
  constructor(users) {
    this._allUsers = users;
  }

  isNewUser(userName){
    return !Object.keys(this._allUsers).includes(userName);
  }

  getUserData(userName){
    return this._allUsers[userName];
  }

  addUser(userName){
    if (this.isNewUser(userName))
    this._allUsers[userName] = {};
  }

  addTodo(userName,title,description,items){
    let user = new User(this.getUserData(userName));
    user.addTodo(title,description,items);
    this._allUsers[userName] = user.getAllTodo();
  }

  deleteTodo(userName,id){
    let user = new User(this.getUserData(userName));
    user.deleteTodo(id);
    this._allUsers[userName] = user.getAllTodo();
  }

  getDatabase(){}
}
module.exports = DatabaseHandler;
