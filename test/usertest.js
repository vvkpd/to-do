let assert = require('chai').assert;
const User = require('../todolib/user.js')

describe('User',()=>{
  var ramu;
  beforeEach(function(){
    ramu = new User({});
  })

  describe('getAllTodo gives all todo',()=>{
    it('is equal to {}',done=>{
      assert.deepEqual(ramu.getAllTodo(),{});
      done();
    })
  })

  describe('addTodo() adds todo in allTodo',()=>{
    it('has one todo',done=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      assert.deepEqual(ramu.getAllTodo(),{'0':{title:'simple todo',itemKey: 0,description:'this is a sample',items:{}}});
      done();
    })
  })

  describe('deleteTodo() deletes todo from allTodo',()=>{
    it('is equal to {} after deleting',done=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      ramu.deleteTodo(0);
      assert.deepEqual(ramu.getAllTodo(),{});
      done();
    })
  })

})
