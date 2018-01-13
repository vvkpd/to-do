class TodoItem {
  constructor(item,status = false) {
    this.item = item;
    this.doneStatus = status;
  }
  getItem(){
    return this.item;
  }
  editItem(newItem){
    this.item = newItem;
  }
  isDone(){
    return this.doneStatus;
  }
  setDoneStatus(status){
    this.doneStatus = status;
  }
}
module.exports = TodoItem;
