const TodoItem = require('./todoitem.js');
class Todo {
  constructor(title,description) {
    this.title = title;
    this.description = description;
    this.items = {};
    this.itemKey = 0;
  }
  get getTitle(){
    return this.title;
  }
  get getDescription(){
    return this.description;
  }
  addItem(item){
    this.items[this.itemKey] = new TodoItem(item);
    this.itemKey++;
  }
  deleteItem(itemId){
    delete this.items[itemId];
  }
  get getItems(){
    return this.items;
  }
  unDone(itemKey){
    this.items[itemKey].setUnDone();
  }
  setDone(itemKey){
    this.items[itemKey].setDone();
  }
  updateItem(itemKey,item){
    this.items[itemKey].update(item);
  }
}

module.exports = Todo;
