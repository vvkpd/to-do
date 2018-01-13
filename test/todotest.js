const Todo = require('../todolib/todo.js');
const TodoItem = require('../todolib/todoitem.js');

let chai = require('chai');
let assert = chai.assert;

describe('TodoList',()=>{
  var todo;
  before(function(){
    todo = new Todo('simple todo','this is a sample');
  })

  describe('getTitle() gives title',()=>{
    it('is equal to simple todo',done=>{
      assert.equal(todo.getTitle(),'simple todo');
      done();
    })
  })

  describe('getDescription() gives discription',()=>{
    it('is equal to "this is a sample"',done=>{
      assert.equal(todo.getDescription(),'this is a sample');
      done();
    })
  })

  describe('getItems() gives items',()=>{
    it('is equal to {}',done=>{
      assert.deepEqual(todo.getItems(),{});
      done();
    })
  })

  describe('addItem() adds item in the items',()=>{
    it('',done=>{
      let item = new TodoItem('clean room');
      todo.addItem(item);
      assert.deepEqual(todo.getItems(),{'clean room':{item:'clean room',doneStatus:false}});
      done();
    })
  })

  describe('addItem() adds item in the items',()=>{
    it('items has atleast one item after adding ',done=>{
      let item = new TodoItem('clean room');
      todo.addItem(item);
      assert.deepEqual(todo.getItems(),{'clean room':{item:'clean room',doneStatus:false}});
      done();
    })
  })

  describe('deleteItem() deletes item from the items',()=>{
    it('items has no item after deleting ',done=>{
      todo.deleteItem('clean room');
      assert.deepEqual(todo.getItems(),{});
      done();
    })
  })
})
