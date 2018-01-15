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
    this.items[this.itemKey] = item;
    this.itemKey++;
  }
  deleteItem(item){
    delete this.items[item];
  }
  get getItems(){
    return this.items;
  }
}

module.exports = Todo;
