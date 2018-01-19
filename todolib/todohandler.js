class Users {
  constructor(users) {
    this._allUsers = users;
  }

  isNewUser(userName){
    return !Object.keys(this._allUsers).includes(userName);
  }

  addUser(userName){
    if (this.isNewUser(userName))
    this._allUsers[userName] = {};
  }

  getUser(userName){
    return this._allUsers[userName];
  }

  getAllUsers(){
    return this._allUsers;
  }

}
module.exports = Users;
