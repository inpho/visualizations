var svg = d3.select("svg");
var w = svg.attr("width");
var h = svg.attr("height");
var t;

function rand(radius, upperBound){
  return Math.random() * (upperBound-2*radius) + radius;
}

function updateLoc(parent, child){

  var x = parent.attr("cx");// + parseInt(child.attr("cx")) / 2;
  var y = parent.attr("cy");// + parseInt(child.attr("cy")) / 2;

  child.style("fill", "steelblue")
    .attr("r", 10)
    .transition().duration(2000)
    .attr("cx", x)
    .attr("cy", y);

  child.style("fill", "red")
    .transition().duration(500)
    .attr("r", 40);
}

function lol() {
  // get the radius
  var radius = parseInt(d3.select("circle").attr("r"));
  var rx = rand(radius, w);
  var ry = rand(radius, h);

  document.getElementById('info').innerHTML = "radius: " + radius + "<br />x: " +  rx + "<br />y: " + ry;


  var father = d3.select("#father");

  var child = d3.select(".child");
  father.transition().duration(1000).attr("cx", rx).attr("cy", ry).style("fill", "steelblue");
  updateLoc(father, child);
  // t=setTimeout("lol()", 1000);
}

