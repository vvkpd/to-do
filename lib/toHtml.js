class Html {
  constructor(content) {
    this.content = content;
  }

  createButtonTag(name,btnId,btnText,action){
    return `<button name="${name}" value="${btnId}" formaction="${action}" type="submit">${btnText}</button>`;
  }

  createFormTag(method,innerElements){
    return `<form method="${method}">${innerElements}</form>`;
  }

  generateHomeContent(){
    let todoId = Object.keys(this.content);
    let contents = "";
    todoId.forEach((id)=>{
      let view = this.createButtonTag('todoId',id,'view/edit','/viewtodo');
      let deleteButton = this.createButtonTag('todoId',id,'delete','/deletetodo');
      contents += `${this.content[id]["title"]}
      ${this.createFormTag('POST',`${view}${deleteButton}`)}<br/>`;
    })
    return contents;
  }

  getViewContent(){
    let title = `<b>Title: </b><input type="text" name="title" value="${this.content.title}"><br>`;
    let description = `<b>Description: </b><input type="text" name="description" value="${this.content.description}"><br>`;
    let itemIds = Object.keys(this.content.items);
    let items=itemIds.map((id)=>{
      let status = this.content.items[id].status ? "checked" : '';
      return `<input type="checkbox" name="todoId" value="${id}" ${status}>
      <input type="text" name="items" value="${this.content.items[`${id}`].item}">`
    }).join(`<br>`)
    return title+description+items;
  }
}

module.exports = Html;
