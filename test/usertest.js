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
      assert.deepEqual(ramu.getAllTodo(),{1:{title:'simple todo',description:'this is a sample',items:{}}});
      done();
    })
  })

  describe('deleteTodo() deletes todo from allTodo',()=>{
    it('is equal to {} after deleting',done=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      ramu.deleteTodo(1);
      assert.deepEqual(ramu.getAllTodo(),{});
      done();
    })
  })

  describe('generateUniqID gives uniq ID',()=>{
    it('should give 1 when user do not have todo',done=>{
      assert.equal(ramu.generateUniqID(),1);
      done();
    })
  })
})
