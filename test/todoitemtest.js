const Item = require('../todolib/todoitem.js');
let chai = require('chai');
let assert = chai.assert;

describe('Item',()=>{
  var item;
  before(function(){
    item = new Item('take tea');
  })
  describe('getItem() gives item',()=>{
    it('is equal to take tea',done=>{
      assert.equal(item.getItem(),'take tea');
      assert.notEqual(item.getItem(),'taketea');
      done();
    })
  })

  describe('editItem() edits item',()=>{
    it('after editing should equal to new item',done=>{
      item.editItem('pandey');
      assert.equal(item.getItem(),'pandey');
      assert.notEqual(item.getItem(),'take tea');
      done();
    })
  })

  describe('isDone gives doneStatus',()=>{
    it('should false',done=>{
      assert.isNotOk(item.isDone());
      done();
    })
  })

  describe('setDoneStatus set the doneStatus',()=>{
    it('should true after set',done=>{
      item.setDoneStatus(true);
      assert.isOk(item.isDone());
      done();
    })
  })
})
