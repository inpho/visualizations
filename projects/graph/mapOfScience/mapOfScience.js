

var width = 600;
var height = 400;

var topMargin = 200;
var leftMargin = 300;

var xScale = (window.innerWidth - leftMargin) / width;
var yScale = (window.innerHeight - topMargin) / height;

var color = {
  "Blue":"Blue",
  "OliveGreen":"#AEB05D",
  "Canary":"#FDB813",
  "Peach":"#FFCC99",
  "Dandelion":"#F0E130",
  "Mahogany":"#670A0A",
  "Lavender":"#E6E6FA",
  "SkyBlue":"SkyBlue",
  "Mulberry":"#C54B8C",
  "BrickRed":"#841F27",
  "Yellow":"Yellow",
  "Emerald":"#55D43F",
  "Red":"Red"
};

var force = d3.layout.force()
  .charge(-120)
  .size([width*xScale, height*yScale]);

var svg = d3.select("#chart").append("svg")
  .attr("width", width * xScale)
  .attr("height", height * yScale);

d3.json("mapOfScienceData.json", function(error, graph) {
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
  
  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x * xScale; })
    .attr("y1", function(d) { return d.source.y * yScale; })
    .attr("x2", function(d) { return d.target.x * xScale; })
    .attr("y2", function(d) { return d.target.y * yScale; })
    .style("stroke-width", function(d) { return Math.sqrt(d.weight)/ 4; })
    .style("stroke", function(d) { if (d.source.color === d.target.color) {
      return color[d.source.color];} else { return "#ccc"; } });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + (d.x * xScale) + "," + (d.y * yScale) + ")"; });

  node.filter( function(d) { return d.group === 1; })
    .append("text")
    .attr("dx", "1em")
    .attr("dy", ".5em")
    .style("stroke", function(d) { return color[d.color]; })
    .style("text-anchor", "start")
    .text( function(d) { return d.name; });

  node.append("circle")
    .attr("r", function(d) { return d.xfact; })
    .style("fill", function(d) { return color[d.color]; })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return d.name; });




  var redraw = function() {
    xScale = window.innerWidth / width;
    yScale = window.innerHeight / height;

    node.attr("transform", function(d) { return "translate(" + (d.x * xScale) + "," + (d.y * yScale) + ")"; });

    link
      .attr("x1", function(d) { return d.source.x * xScale; })
      .attr("y1", function(d) { return d.source.y * yScale; })
      .attr("x2", function(d) { return d.target.x * xScale; })
      .attr("y2", function(d) { return d.target.y * yScale; });
  };

  

  force.stop();  
});