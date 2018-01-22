const setDisable = function(){
  let inputBoxes = document.getElementsByTagName("input");
  [...inputBoxes].forEach((input)=>{
    input.disabled = true;
  })
}

const setEnable = function(){
  let inputBoxes = document.getElementsByTagName("input");
  [...inputBoxes].forEach((input)=>{
    input.disabled = false;
  })
}

window.onload = setDisable;
