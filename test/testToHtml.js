const assert = require('chai').assert;
const Html = require('../lib/toHtml.js');

describe('Html',()=>{
  describe('Home content',()=>{
    let html;
    before(()=>{
      let todos={
        1: {
          "title": "simple",
          "description": "Simple dress",
          "items": {
            "1": {
              "item": "take break",
              "doneStatus": false
            }
          }
        }
      }
      html = new Html(todos);
    })
    describe('createButtonTag()',()=>{
      it('should give button tag',()=>{
        let btn = html.createButtonTag('todoId',2,'save','saveTodo');
        let expected = '<button name="todoId" value="2" formaction="saveTodo" type="submit">save</button>';
        assert.equal(btn,expected);
      })
    })

    describe('createFormTag()',()=>{
      it('should give form tag with inner elements',()=>{
        let btn = html.createButtonTag('todoId',2,'save','saveTodo');
        let form = html.createFormTag("POST",btn);
        let expected = '<form method="POST"><button name="todoId" value="2" formaction="saveTodo" type="submit">save</button></form>';
        assert.equal(form,expected);
      })

      it('should give form tag without inner elements',()=>{
        let form = html.createFormTag("POST");
        let expected='<form method="POST"></form>';
        assert.equal(form,expected);
      })
    })

    describe('generateHomeContent()',()=>{
      it('should convert given todos into html format',()=>{
        let form = html.generateHomeContent();
        let expected = 'simple<form method="POST"><button name="todoId" value="1" formaction="/viewtodo" type="submit">view/edit</button><button name="todoId" value="1" formaction="/deletetodo" type="submit">delete</button></form><br/>'
        assert.equal(form,expected);
      })
    })
  })

  describe('View Content',()=>{
    let html;
    before(()=>{
      let todo={
        "todoId":1,
        "title": "simple",
        "description": "Simple dress",
        "items": {
          "1": {
            "item": "take break",
            "doneStatus": false
          }
        }
      }
      html = new Html(todo);
    })
    describe('createTextbox()',()=>{
      it('should generate textbox',()=>{
        let txtBox = html.createTextbox('item','2');
        let expected = '<input type="text" name="item" value="2"/><br>'
        assert.equal(txtBox,expected);
      })
    })

    describe('createCheckbox()',()=>{
      it('should generate checked checkbox',()=>{
        let checkbox = html.createCheckBox('item','2',"checked");
        let expected = '<input type="checkbox" name="item" value="2" checked/>';
        assert.equal(checkbox,expected);
      })

      it('should generate unchecked checkbox',()=>{
        let checkbox = html.createCheckBox('item','2','');
        let expected = '<input type="checkbox" name="item" value="2" />';
        assert.equal(checkbox,expected);
      })
    })

    describe('createTextboxWithTitle()',()=>{
      it('should generate textbox with title before tag',()=>{
        let txtBox = html.createTextboxWithTitle('Name','todo','2');
        let expected = '<b>Name: </b><input type="text" name="todo" value="2"/><br>';
        assert.equal(txtBox,expected);
      })
    })

    describe('generateViewContent()',()=>{
      it('should convert given todo into html format',()=>{
        let view = html.generateViewContent();
        let expected = '<b>Title: </b><input type="text" name="title" value="simple"/><br><b>Description: </b><input type="text" name="description" value="Simple dress"/><br>Items: <input type="checkbox" name="itemId" value="1" />\n      <input type="text" name="items" value="take break"/><br><button name="todoId" value="1" formaction="/updateTodo" type="submit">save</button>';
        assert.equal(view,expected);
      })
    })
  })
})
