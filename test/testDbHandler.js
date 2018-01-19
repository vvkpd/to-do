const DbHandler = require('../todolib/DatabaseHandler.js');
let assert = require('chai').assert;

describe('DatabaseHandler',()=>{
  let dbHandler;
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
    dbHandler = new DbHandler(db);
  })

  describe('isNewUser',()=>{
    it('should check wheather user is new or not',()=>{
      assert.isOk(dbHandler.isNewUser('shyam'));
      assert.isNotOk(dbHandler.isNewUser('vivek'));
    })
  })

  describe('addUser',()=>{
    it('should add new user in database',()=>{
      dbHandler.addUser('ramu');
      let expected = {};
      assert.deepEqual(dbHandler.getUserData('ramu'),expected);
    })
  })

  describe('getUserData',()=>{
    it('should give todos of user',()=>{
      dbHandler.addUser('vivek');
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
      assert.deepEqual(dbHandler.getUserData('vivek'),expected);
    })
  })

  describe('addTodo',()=>{
    it("should add new todo in particular user's todos",()=>{
      dbHandler.addUser('ramu');
      dbHandler.addTodo('ramu','sample',"sample file",['eat','sleep']);
      let expected = {
        1: {
          "title": "sample",
          "description": "sample file",
          "items": {
            1: {
              "item": "eat",
              "doneStatus": false
            },
            2: {
              "item": "sleep",
              "doneStatus": false
            }
          }
        }
      }
      assert.deepEqual(dbHandler.getUserData('ramu'),expected);
    })
  })

  describe('deleteTodo',()=>{
    it("should delete todo from particular user's todos",()=>{
      dbHandler.addUser('vivek');
      dbHandler.deleteTodo('vivek',1)
      let expected = {}
      assert.deepEqual(dbHandler.getUserData('vivek',1),expected);
    })
  })
})
