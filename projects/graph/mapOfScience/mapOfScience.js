

var width = 600;
var height = 400;

var topMargin = 200;
var leftMargin = 300;

var scale = (window.innerWidth - leftMargin) / width;

var color = {
  "Blue":d3.rgb("#0000FF"),
  "OliveGreen":d3.rgb("#AEB05D"),
  "Canary":d3.rgb("#FDB813"),
  "Peach":d3.rgb("#FFCC99"),
  "Dandelion":d3.rgb("#F0E130"),
  "Mahogany":d3.rgb("#670A0A"),
  "Lavender":d3.rgb("#E6E6FA"),
  "SkyBlue":d3.rgb("#87CEEB"),
  "Mulberry":d3.rgb("#C54B8C"),
  "BrickRed":d3.rgb("#841F27"),
  "Yellow":d3.rgb("#FFFF00"),
  "Emerald":d3.rgb("#55D43F"),
  "Red":d3.rgb("#FF0000")
}

var force = d3.layout.force()
  .charge(-120)
  .size([width*scale, height*scale]);

var chart = d3.select("#chart")


var scaleDiv = chart.append("div").attr("id","#scaleDiv");

var scaleSlider = scaleDiv
  .append("input")
  .attr("type", "range")
  .attr("name", "scale")
  .attr("id", "scaleSlider")
  .attr("min", "1")
  .attr("max", "4")
  .attr("step", ".1")
  .attr("value", scale);
scaleDiv.append("text").text("Scale");

var filterDiv = chart.append("div").attr("id", "#filterDiv");


var filterSlider = filterDiv.append("input")
  .attr("type", "range")
  .attr("name", "scale")
  .attr("id", "filterSlider")
  .attr("min", "0")
  .attr("max", "500")
  .attr("step", "5")
  .attr("value", scale);
filterDiv.append("text").text("Filter Weights");

filterSlider.on("change", function(d) {
  console.log(this.value);
  
});



var svg = chart.append("svg")
  .attr("width", width * scale)
  .attr("height", height * scale);

var force;
var data;

d3.json("mapOfScienceData.json", function(error, graph) {
  data = graph;
  update(graph);
});
 
 
function update(graph) {
  force = force
    .nodes(graph.nodes)
    .links(graph.links)
    .start()
    .stop();

  svg.attr("width", width * scale)
    .attr("height", height * scale);
  
  var link = svg.selectAll(".link")
    .data(graph.links);

  var linkEnter = link.enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.weight)/ 4; })
    .style("stroke", function(d) { if (d.source.color === d.target.color) {
      return color[d.source.color];} else { return "#ccc"; } });

  var linkUpdate = link
    .attr("x1", function(d) { return d.source.x * scale; })
    .attr("y1", function(d) { return d.source.y * scale; })
    .attr("x2", function(d) { return d.target.x * scale; })
    .attr("y2", function(d) { return d.target.y * scale; });
  
  var linkExit = link.exit()
    .remove();
  
  
  var node = svg.selectAll(".node")
    .data(graph.nodes);

  var nodeEnter = node.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + (d.x * scale) + "," + (d.y * scale) + ")"; });

  var nodeUpdate = node
    .attr("transform", function(d) { return "translate(" + (d.x * scale) + "," + (d.y * scale) + ")"; });

  var nodeExit = node.exit()
    .transition()
    .duration(500)
    .remove();
  
  node.filter( function(d) { return d.group === 1; })
    .append("text")
    .attr("dx", "1em")
    .attr("dy", ".5em")
    .style("stroke", function(d) { return color[d.color].darker(2); })
    .style("text-anchor", "start")
    .text( function(d) { return d.name; });
  
  node.append("circle")
    .attr("r", function(d) { return d.xfact; })
    .style("fill", function(d) { return color[d.color]; });
  
  node.append("title")
    .text(function(d) { return d.name; });


  scaleSlider.on("change", function(event) {
    scale = this.value;
    update(graph);
  });
  
  filterSlider.on("change", function(event) {
    // Requires more thought...
    update(node.filter(function(d) { return d.value >= this.value; }));
  });
}

