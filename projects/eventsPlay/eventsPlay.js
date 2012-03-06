/*
  eventsPlay.js
*/


var main = function() {
  
  var container = document.getElementById("container");


  // generate us some of them thar divs
  for(var i = 0; i < 10; i++){
    var div = document.createElement("div");
    div.setAttribute("class", "box");

    div.onclick = function(n){ return function(){ alert(n); } }(i);
    container.appendChild(div);
  }
  
};



jQuery(document).ready(main);