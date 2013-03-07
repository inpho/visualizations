/**
 * mapOfScience.js
 *
 * Samuel Waggoner
 * srwaggon@indiana.edu / Samuel.Waggoner@gmail.com
 * 2/22/2013
 *
 * Generates Katy Borner's Map of Science using
 * mbostock's D3js
 *
 */

var width = window.innerWidth;
var height = window.innerHeight;

var xScale = width / 470;
var yScale = height / 330;
var xOffset = -80 * xScale;
var yOffset = -80 * yScale;


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


var chart = d3.select("#chart")

var sliderDiv = chart.append("div")
  .attr("id", "sliderDiv")
  .style("width", "800px");

// var scaleDiv = sliderDiv.append("div")
//   .attr("id","scaleDiv")
//   .attr("class", "slider")
//   .attr("float", "left");

// var scaleSlider = scaleDiv
//   .append("input")
//   .attr("type", "range")
//   .attr("name", "scale")
//   .attr("id", "scaleSlider")
//   .attr("min", "1")
//   .attr("max", "4")
//   .attr("step", ".5")
//   .attr("value", 2.5);
// scaleDiv.append("text").text("Scale");

var weightDiv = sliderDiv.append("div")
  .attr("id", "weightDiv")
  .attr("class", "slider")
  .attr("float", "left")
  .attr("size", 1000);

var weightSlider = weightDiv.append("input")
  .attr("type", "range")
  .attr("name", "scale")
  .attr("id", "weightSlider")
  .attr("min", 1)
  .attr("max", 10)// "21") actual maximum.
  .attr("step", 1)
  .attr("value", 10);
weightDiv.append("text").text("Weight");

var fullGraph;


var force = d3.layout.force()
  .charge(0) // might be important.. 
  .size([width * xScale, height * yScale]);

var svg = chart.append("svg")
  .attr("width", width * .95)
  .attr("height", height * .93);



d3.json("mapOfScienceData.json", function(error, data) {
  fullGraph = data;
  force = force
    .nodes(data.nodes)
    .links(data.links)
    .start()
    .stop();

    svg.call(d3.behavior.zoom()
             .on("zoom", function() {
               if (d3.event.sourceEvent.type=='mousewheel' || d3.event.sourceEvent.type=='DOMMouseScroll') {
                 var wheelDelta = d3.event.sourceEvent.wheelDelta;
                 var delta = parseInt(wheelDelta / 100) * 0.5;
                 xScale += delta;
                 yScale += delta;
                 render(500, xScale, yScale);
               }}));

  svg.call(d3.behavior.drag()
           .on("drag", function() {
             xOffset += d3.event.sourceEvent.webkitMovementX;
             yOffset += d3.event.sourceEvent.webkitMovementY;
             render(0, xScale, yScale);
           }));

  buildRender(data);
});



function buildRender(graph) {
  /**
   * Perform the join, render the data,
   * and then add the labels.
   */

  
  updateData(graph.nodes, graph.links);

  var node = svg.selectAll(".node")
    .data(graph.nodes, function(d) {
      return d.name;
    });

  // text label nodes
  node.filter( function(d) { return d.group === 1; })
    .append("text")
    .attr("dx", "1em")
    .attr("dy", ".5em")
    .style("stroke", function(d) { return color[d.color].darker(2); })
    .style("text-anchor", "start")
    .text( function(d) { return d.name; });
  
  node.append("title").text(function(d) { return d.name; });
}



function updateData(nodes, links) {
  /**
   * Called whenever the data changes. Performs a join.
   */

  /**************
   * LINKS
   *************/

  // set compare
  var link = svg.selectAll(".link")
    .data(links, function(d) {
      return "" + d.source.name + d.target.name;
    });

  // introduce new
  var linkEnter = link.enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(Math.sqrt(Math.sqrt(d.weight))); })
    .style("stroke", function(d) { if (d.source.color === d.target.color) {
      return color[d.source.color];} else { return "#ccc"; } });

  // update existing
  var linkUpdate = link
    .attr("x1", function(d) { return d.source.x * xScale + xOffset; })
    .attr("y1", function(d) { return d.source.y * yScale + yOffset; })
    .attr("x2", function(d) { return d.target.x * xScale + xOffset; })
    .attr("y2", function(d) { return d.target.y * yScale + yOffset; });
  
  // remove expiring
  var linkExit = link.exit().remove();



  /**************
   * NODES
   *************/

  // set compare
  var node = svg.selectAll(".node")
    .data(nodes, function(d) {
      return d.name;
    });

  // introduce new
  var nodeEnter = node.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + (d.x * xScale + xOffset) + "," + (d.y * yScale + yOffset) + ")"; });

  nodeEnter.append("circle")
    .attr("r", function(d) { return d.xfact; })
    .style("fill", function(d) { return color[d.color]; });

  
  // update existing
  var nodeUpdate = node
    .attr("transform", function(d) { return "translate(" + (d.x * xScale + xOffset) + "," + (d.y * yScale + yOffset) + ")"; });

  // remove expiring
  var nodeExit = node.exit().remove();

}



function render(transitionDuration, xScale, yScale) {
  
  var link = svg.selectAll(".link");
  var node = svg.selectAll(".node");
  
  // update existing
  var linkUpdate = link.transition().duration(transitionDuration)
    .attr("x1", function(d) { return d.source.x * xScale + xOffset; })
    .attr("y1", function(d) { return d.source.y * yScale + yOffset; })
    .attr("x2", function(d) { return d.target.x * xScale + xOffset; })
    .attr("y2", function(d) { return d.target.y * yScale + yOffset; });
  
  // update existing
  var nodeUpdate = node.transition().duration(transitionDuration)
    .attr("transform", function(d) { return "translate(" + (d.x * xScale + xOffset) + "," + (d.y * yScale + yOffset) + ")"; });

}

// scaleSlider.on("change", function(event) {
//   setScale(this.value);
//   render(500, this.value);
// });


weightSlider.on("change", function(event) {
  applyFilter(function(data) {
    return data.group === 1 || data.xfact >= weightSlider.property("max") - weightSlider.property("value");
  });
});


function applyFilter(filter) {
  var n = fullGraph.nodes.filter(
    function(d) {
      return filter(d);
    });

  var l = fullGraph.links.filter(
    function(d) {
      return filter(d.source) && filter(d.target);
    });

  updateData(n, l);
}

window.onresize = function(event) {
  svg.attr("width", window.innerWidth * .95)
    .attr("height", window.innerHeight * .93);

  xScale = window.innerWidth / 470;
  yScale = window.innerHeight / 330;

  render(0, xScale, yScale);
}