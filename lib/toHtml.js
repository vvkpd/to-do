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
}

module.exports = Html;
