class TodoItem {
  constructor(item) {
    this.item = item;
    this.doneStatus = false;
  }
  getItem(){
    return this.item;
  }
  update(newItem){
    this.item = newItem;
  }
  isDone(){
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
