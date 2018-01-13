class Todo {
  constructor(title,description) {
    this.title = title;
    this.description = description;
    this.items = {};
  }
  getTitle(){
    return this.title;
  }
  getDescription(){
    return this.description;
  }
  addItem(item){
    this.items[item.getItem()] = item;
  }
  deleteItem(item){
    delete this.items[item];
  }
  getItems(){
    return this.items;
  }
}

module.exports = Todo;
