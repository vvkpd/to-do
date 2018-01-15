class TodoItem {
  constructor(item) {
    this.item = item;
    this.doneStatus = false;
  }
  get getItem(){
    return this.item;
  }
  update(newItem){
    this.item = newItem;
  }
  get isDone(){
    return this.doneStatus;
  }
  setDone(){
    this.doneStatus = true;
  }
  setUnDone(){
    this.doneStatus = false;
  }
}
module.exports = TodoItem;
