

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

var graph;
var force = d3.layout.force()
  .charge(-120)
  .size([width*scale, height*scale]);


var chart = d3.select("#chart")

var sliderDiv = chart.append("div")
  .attr("id", "sliderDiv")
  .style("width", "800px");

var scaleDiv = sliderDiv.append("div")
  .attr("id","scaleDiv")
  .attr("class", "slider")
  .attr("float", "left");

var scaleSlider = scaleDiv
  .append("input")
  .attr("type", "range")
  .attr("name", "scale")
  .attr("id", "scaleSlider")
  .attr("min", "1")
  .attr("max", "4")
  .attr("step", ".5")
  .attr("value", scale);
scaleDiv.append("text").text("Scale");

function setScale(value) {
  scale = value >= 1.0 && value <= 4.0 ? value : scale;
  scaleSlider.property("value", scale);
}


var filterDiv = sliderDiv.append("div")
  .attr("id", "filterDiv")
  .attr("class", "slider")
  .attr("float", "left")
  .attr("size", 1000);

var filterSlider = filterDiv.append("input")
  .attr("type", "range")
  .attr("name", "scale")
  .attr("id", "filterSlider")
  .attr("min", 0)
  .attr("max", 10)// "21") actual maximum.
  .attr("step", 1)
  .attr("value", 0);
filterDiv.append("text").text("Weight");


var svg = chart.append("svg")
  .attr("width", width * 4)
  .attr("height", height * 4);

d3.json("mapOfScienceData.json", function(error, data) {
  graph = data
  force = force
    .nodes(data.nodes)
    .links(data.links)
    .start()
    .stop();

    svg.call(d3.behavior.zoom()
             .on("zoom", function() {
               if (d3.event.sourceEvent.type=='mousewheel' || d3.event.sourceEvent.type=='DOMMouseScroll') {
                 if (d3.event.sourceEvent.wheelDelta > 0) {
                   setScale(scale + 0.5);
                 } else {
                   setScale(scale - 0.5);
                 }
               }
               update(graph.nodes, graph.links);
             }));
  
  update(data.nodes, data.links);
});

 


 
function update(nodes, links) {
  var duration = d3.event && d3.event.altKey ? 5000 : 1000;  



  var link = svg.selectAll(".link")
    .data(links, function(d) { 
      return "" + d.source.name + d.target.name;
    });

  var linkEnter = link.enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.weight) / 3; })
    .style("stroke", function(d) { if (d.source.color === d.target.color) {
      return color[d.source.color];} else { return "#ccc"; } });

  var linkUpdate = link.transition()
    .duration(duration)
    .attr("x1", function(d) { return d.source.x * scale; })
    .attr("y1", function(d) { return d.source.y * scale; })
    .attr("x2", function(d) { return d.target.x * scale; })
    .attr("y2", function(d) { return d.target.y * scale; });
  
  var linkExit = link.exit()
    .transition()
    .duration(duration)
    .remove();
  


  
  var node = svg.selectAll(".node")
    .data(nodes, function(d) {
      return d.name;
    });

  var nodeEnter = node.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + (d.x * scale) + "," + (d.y * scale) + ")"; });

  var nodeUpdate = node
    .transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + (d.x * scale) + "," + (d.y * scale) + ")"; });

  var nodeExit = node.exit()
    .transition()
    .duration(duration)
    .remove();

  /* text label nodes */  
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
    setScale(this.value);
    update(nodes, links);
  });

  
  filterSlider.on("change", function(event) {
    // Requires more thought...
    var val = this.value;//filterSlider.property("value");

    var n = graph.nodes.filter(
      function(d) {
        return d.group === 1 || d.xfact >= val;
      });

    var l = graph.links.filter(
      function(d) {
        return d.source.xfact >= val && d.target.xfact >= val;
      });
    update(n, l);
  });
}

