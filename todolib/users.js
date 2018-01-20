const User = require('./user.js');
class Users {
  constructor(users) {
    this._allUsers = users;
  }

  isNewUser(userName){
    return !this._allUsers[userName];
  }

  getUserData(userName){
    return this._allUsers[userName];
  }

  addUser(userName){
    if (this.isNewUser(userName))
    this._allUsers[userName] = {};
  }

  createUser(userName){
    this.addUser(userName);
    return new User(this.getUserData(userName));
  }

  getUsers(){
    return this._allUsers;
  }

}
module.exports = Users;
