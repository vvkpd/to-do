const Users = require('../todolib/users.js');
let assert = require('chai').assert;

describe('Users',()=>{
  let users;
  beforeEach(function(){
    let db = {
      "vivek": {
        "1": {
          "title": "simple",
          "description": "Simple dress",
          "items": {
            "1": {
              "item": "take break",
              "doneStatus": false
            }
          }
        }
      }
    };
    users = new Users(db);
  })

  describe('isNewUser',()=>{
    it('should check wheather user is new or not',()=>{
      assert.isOk(users.isNewUser('shyam'));
      assert.isNotOk(users.isNewUser('vivek'));
    })
  })

  describe('addUser',()=>{
    it('should add new user in users',()=>{
      users.addUser('ramu');
      let expected = {};
      assert.deepEqual(users.getUserData('ramu'),expected);
    })

    it('should not create new key for existing user',()=>{
      users.addUser('vivek');
      let expected ={
        "1": {
          "title": "simple",
          "description": "Simple dress",
          "items": {
            "1": {
              "item": "take break",
              "doneStatus": false
            }
          }
        }
      };
      assert.deepEqual(users.getUserData('vivek'),expected);
    })
  })

  describe('createUser',()=>{
    it('should create user',()=>{
      let ramu = users.createUser('ramu');
      let expected = {"allTodo": {}};
      assert.deepEqual(ramu,expected);
    })
  })

  describe('getUserData',()=>{
    it('should give todos of user',()=>{
      users.addUser('vivek');
      let expected = {
        "1": {
          "title": "simple",
          "description": "Simple dress",
          "items": {
            "1": {
              "item": "take break",
              "doneStatus": false
            }
          }
        }
      }
      assert.deepEqual(users.getUserData('vivek'),expected);
    })
  })

  describe('getUsers',()=>{
    it("should give whole users data",()=>{
      let expected = {
        "vivek": {
          "1": {
            "title": "simple",
            "description": "Simple dress",
            "items": {
              "1": {
                "item": "take break",
                "doneStatus": false
              }
            }
          }
        }
      };
      assert.deepEqual(users.getUsers(),expected);
    })
  })

  describe('userOperation',()=>{
    it('should update user details after each operation',()=>{
      let ramu = users.createUser('ramu');
      let expected = {};
      assert.deepEqual(users.getUserData('ramu'),expected);
      ramu.addTodo('title','desc',[1,2]);
      expected = {
        1:{
          "title": "title",
          "description": "desc",
          items:{
            1:{item:1,status:false},
            2:{item:2,status:false}
          }
        }
      };
      assert.deepEqual(users.getUserData('ramu'),expected);
    })
  })
});
