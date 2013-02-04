var width = 1600, height = 1200;

var xOffset = 300;
var yOffset = 300;

var force = d3.layout.force()
  .charge(-120)
  .size([width, height]);

var svg = d3.select("#chart").append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("map.json", function(error, graph) {
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
  
  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.filter( function(d) { return d.group === 1; })
    .append("text")
    .attr("dx", "1em")
    .attr("dy", ".5em")
    .style("stroke", function(d) { return d.color; })
    .style("text-anchor", "start")
    .text( function(d) { return d.name; });

  node.append("circle")
    .attr("r", 5)
    .style("fill", function(d) { return d.color; })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return d.name; });

  force.stop();  
});
