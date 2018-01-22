let assert = require('chai').assert;
const User = require('../model/user.js')

describe('User',()=>{
  var ramu;
  beforeEach(function(){
    ramu = new User({});
  })

  describe('getAllTodo',()=>{
    it('gives all todo',()=>{
      assert.deepEqual(ramu.getAllTodo(),{});
    })
  })

  describe('addTodo()',()=>{
    it('adds todo in allTodo',()=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      assert.deepEqual(ramu.getAllTodo(),{1:{title:'simple todo',description:'this is a sample',items:{}}});
    })
  })

  describe('deleteTodo()',()=>{
    it('should delete todo if todo is present',()=>{
      ramu.addTodo('simple todo','this is a sample',[]);
      assert.isOk(ramu.deleteTodo(1));
    })

    it('should not delete todo if todo is absent',()=>{
      assert.isNotOk(ramu.deleteTodo(1));
    })
  })

  describe('generateUniqID',()=>{
    it('should give 1 when user do not have todo',()=>{
      assert.equal(ramu.generateUniqID(),1);
    })

    it('should give 2 when user have one todo',()=>{
      ramu.addTodo("sample","sample file",['one','two']);
      assert.equal(ramu.generateUniqID(),2);
    })
  })

  describe('getTodo',()=>{
    it('should give specified todo',()=>{
      ramu.addTodo("sample","sample file",['one','two']);
      let expected = {
        title:'sample',
        description:'sample file',
        items:
        { 1:{item:'one', status:false},
          2:{item:'two', status:false}
        }
      }
    assert.deepEqual(ramu.getTodo(1),expected);
    })
  })
})
