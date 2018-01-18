let getUserName = function(){
  let user = document.getElementById('username');
  user.innerText = `User: ${userName}`;
}
window.onload = getUserName;
