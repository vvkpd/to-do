const TodoItem = require('./todoitem.js');
class Todo {
  constructor(title,description) {
    this.title = title;
    this.description = description;
    this.items = {};
    this.itemKey = 0;
  }
  getTitle(){
    return this.title;
  }
  getDescription(){
    return this.description;
  }
  addItem(item){
    this.items[this.itemKey] = new TodoItem(item);
    this.itemKey++;
  }
  deleteItem(itemId){
    delete this.items[itemId];
  }
  getItems(){
    return this.items;
  }
  setUnDone(itemKey){
    this.items[itemKey].setUnDone();
    return this.items[itemKey].isDone;
  }
  setDone(itemKey){
    this.items[itemKey].setDone();
    return this.items[itemKey].isDone;
  }
  updateItem(itemKey,item){
    this.items[itemKey].update(item);
  }
}

module.exports = Todo;
