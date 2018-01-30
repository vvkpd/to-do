class TodoItem {
	constructor(item) {
		this.item = item;
		this.status = false;
	}
	getItem(){
		return this.item;
	}
	update(newItem){
		this.item = newItem;
	}
	isDone(){
		return this.status;
	}
	setDone(){
		this.status = true;
	}
	setUnDone(){
		this.status = false;
	}
}
module.exports = TodoItem;
