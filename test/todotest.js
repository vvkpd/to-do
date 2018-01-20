const Todo = require('../todolib/todo.js');
const TodoItem = require('../todolib/todoitem.js');

let chai = require('chai');
let assert = chai.assert;

describe('Todo',()=>{
  var todo;
  beforeEach(function(){
    todo = new Todo('simple todo','this is a sample');
  })

  describe('getTitle gives title',()=>{
    it('is equal to simple todo',done=>{
      assert.equal(todo.getTitle(),'simple todo');
      done();
    })
  })

  describe('getDescription gives discription',()=>{
    it('is equal to "this is a sample"',done=>{
      assert.equal(todo.getDescription(),'this is a sample');
      done();
    })
  })

  describe('getItems gives items',()=>{
    it('is equal to {}',done=>{
      assert.deepEqual(todo.getItems(),{});
      done();
    })
  })

  describe('addItem() adds item in the items',()=>{
    it('adds item in items',done=>{
      todo.addItem('clean room');
      assert.deepEqual(todo.getItems(),{'1':{item:'clean room',status:false}});
      done();
    })
  })

  describe('addItems() adds item in the items',()=>{
    it('adds item in items',done=>{
      todo.addItems(['clean room','take break']);
      let expected = { 1:{ item: 'clean room', status: false },
                      2:{ item: 'take break', status: false } }
      assert.deepEqual(todo.getItems(),expected);
      done();
    })
  })

  describe('updateItem() updates item in the items',()=>{
    it('item should update',done=>{
      todo.addItem('clean room');
      assert.deepEqual(todo.getItems(),{'1':{item:'clean room',status:false}});
      todo.updateItem(1,'clean everything');
      assert.deepEqual(todo.getItems(),{'1':{ item:'clean everything',status:false}});
      done();
    })
  })

  describe('deleteItem() deletes item from the items',()=>{
    it('items has no item after deleting ',done=>{
      todo.addItem('clean room');
      todo.deleteItem('1');
      assert.deepEqual(todo.getItems(),{});
      done();
    })
  })

  describe('setDone() sets status of item in the items',()=>{
    it('item status should true',done=>{
      todo.addItem('clean room');
      assert.ok(todo.setDone(1));
      done();
    })
  })

  describe('setUnDone() sets status of item in the items',()=>{
    it('item status should true',done=>{
      todo.addItem('clean room');
      assert.notOk(todo.setUnDone(1));
      done();
    })
  })

  describe('generateUniqID gives uniq ID',()=>{
    it('should give 1 when todo do not have item',done=>{
      assert.equal(todo.generateUniqID(),1);
      done();
    })
  })
})
