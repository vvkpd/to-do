class Html {
  constructor(content) {
    this.content = content;
  }

  createButtonTag(name,btnId,btnText,action){
    return `<button name="${name}" value="${btnId}" formaction="${action}" type="submit">${btnText}</button>`;
  }

  createFormTag(method,innerElements=''){
    return `<form method="${method}">${innerElements}</form>`;
  }

  generateHomeContent(){
    if(!this.content) return '';
    let todoId = Object.keys(this.content);
    let contents = "";
    todoId.forEach((id)=>{
      let view = this.createButtonTag('todoId',id,'view/edit','/viewtodo');
      let deleteButton = this.createButtonTag('todoId',id,'delete','/deletetodo');
      let form = this.createFormTag('POST',`${view}${deleteButton}`);
      contents += `${this.content[id]["title"]}${form}<br/>`;
    })
    return contents;
  }

  createTextbox(name,value){
    return `<input type="text" name="${name}" value="${value}"/><br>`;
  }

  createCheckBox(name,value,status){
    return `<input type="checkbox" name="${name}" value="${value}" ${status}/>`;
  }

  createTextboxWithTitle(title,name,value){
    return `<b>${title}: </b>${this.createTextbox(name,value)}`;
  }

  getCheckedAction(status){
    return status ? "checked" : '';
  }

  generateViewContent(){
    let todo = this.content;
    let title = this.createTextboxWithTitle('Title','title',todo.title);
    let description = this.createTextboxWithTitle('Description','description',todo.description)
    let itemIds = Object.keys(todo.items);
    let items=itemIds.map((id)=>{
      let status = this.getCheckedAction(todo.items[id].status);
      return `${this.createCheckBox('itemId',id,status)}
      ${this.createTextbox('items',`${todo.items[`${id}`].item}`)}`;
    }).join('');
    let submit = this.createButtonTag('todoId',todo.todoId,'save','/updateTodo');
    return title+description+'Items: '+items+submit;
  }
}

module.exports = Html;
