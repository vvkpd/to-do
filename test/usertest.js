const Todo = require('../todolib/todo.js');
const User = require('../todolib/user.js')

let chai = require('chai');
let assert = chai.assert;

describe('User',()=>{
  var ramu;
  before(function(){
    ramu = new User();
  })

  describe('getAllTodo gives all todo',()=>{
    it('is equal to {}',done=>{
      assert.deepEqual(ramu.getAllTodo,{});
      done();
    })
  })

  describe('addTodo() adds todo in allTodo',()=>{
    it('is equal to {}',done=>{
      let todo = new Todo('simple todo','this is a sample');
      ramu.addTodo(todo);
      assert.deepEqual(ramu.getAllTodo,{'0':{title:'simple todo',"itemKey": 0,description:'this is a sample',items:{}}});
      done();
    })
  })

  describe('deleteTodo() deletes todo from allTodo',()=>{
    it('is equal to {}',done=>{
      ramu.deleteTodo('0');
      assert.deepEqual(ramu.getAllTodo,{});
      done();
    })
  })

})
