let assert = require('chai').assert;
const User = require('../model/user.js')

describe('User',()=>{
  var ramu;
  beforeEach(function(){
    ramu = new User({});
  })

  describe('getAllTodo',()=>{
    it('gives all todo',done=>{
      assert.deepEqual(ramu.getAllTodo(),{});
      done();
    })
  })

  describe('addTodo()',()=>{
    it(' adds todo in allTodo',done=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      assert.deepEqual(ramu.getAllTodo(),{1:{title:'simple todo',description:'this is a sample',items:{}}});
      done();
    })
  })

  describe('deleteTodo()',()=>{
    it('should delete todo if todo is present',done=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      assert.isOk(ramu.deleteTodo(1));
      done();
    })

    it('should not delete todo if todo is absent',done=>{
      assert.isNotOk(ramu.deleteTodo(1));
      done();
    })
  })

  describe('generateUniqID',()=>{
    it('should give 1 when user do not have todo',done=>{
      assert.equal(ramu.generateUniqID(),1);
      done();
    })
  })
})
