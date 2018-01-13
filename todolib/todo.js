class Todo {
  constructor(title,description) {
    this.title = title;
    this.description = title;
    this.items = [];
  }
  getTitle(){
    return this.title;
  }
}

module.exports = Todo;
