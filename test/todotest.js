const Todo = require('../todolib/todo.js');
let chai = require('chai');
let assert = chai.assert;

describe('TodoList',()=>{
  var todo;
  before(function(){
    item = new Todo('simple todo','this is a sample');
  })
  describe('getTitle() gives title',()=>{
    it('is equal to simple todo',done=>{
      assert.equal(item.getTitle(),'simple todo');
      done();
    })
  })
})
