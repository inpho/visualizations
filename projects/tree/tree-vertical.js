var margin = 20
var w = 360;
var h = 2000;
var root;
var i = 0;

var tree = d3.layout.tree()
  .size([w, h]);


var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.x, d.y]; });

d3.json("../../data/inpho.json", function(json) {
  root = json;
  root.x0 = 0;
  root.y0 = 0;
  
  update(root);
  
});

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

var vis = d3.select("#chart").append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin +")");

var filling = function(d) { return d._children ? "lightsteelblue" : "#fff"; };

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;
  var nodes = tree.nodes(root);

  var xindent = 20;
  var yindent = 20;
  var i = 0;

  nodes.forEach(function(d) { 
    d.x = xindent * d.depth;
    d.y = yindent * i++;
  });

  d3.select("svg").attr("height", function() { return margin + (nodes.length * yindent) });

  /***  NODE HANDLING  ***/
  var node = vis.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  // Enter in any newfound nodes at parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.x0 + "," + source.y0 + ")";
    });

  // Draw a circle for each newly-found node.
  nodeEnter.append("svg:circle")
    .attr("r", 4.5)
    .style("fill", filling)
    .on("click", function(d) {
      toggle(d);
      update(d);
    });

  // Draw a label for each newly-found node.
  nodeEnter
    .append("svg:a")
    .attr("xlink:href", function(d) { return "https://inpho.cogs.indiana.edu" + d.url; })
    .append("svg:text")
    .attr("dx", 8)
    .attr("dy", 3)
    //.attr("fill", "steelblue")
    .attr("text-anchor", "start")
    .text(function(d) {
      return d.name;
    });
  /*
    .on("click", function(d) {
      //alert( d.url );
      window.location.href= "https://inpho.cogs.indiana.edu" + d.url;
    });
  */

  //Transition nodes to their new positions.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
    .style("fill", filling);

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // remove any exiting nodes.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);
  


  /***  LINK HANDLING  ***/
  var link = vis.selectAll("path.link")
    .data(tree.links(nodes), function(d) { return d.target.id; });

  // Draw new lines from the new node
  link.enter().insert("svg:line", "g")
    .attr("class", "link")
    .attr("x1", function(d) { return d.x; })
    .attr("y1", function(d) { return d.y; })
    .attr("x2", function(d) { return d.x; })
    .attr("y2", function(d) { return d.y; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    })
    .transition()
    .duration(duration)
    .attr("d", diagonal);



  // Transition unchanged links to their new positions. 
  link.transition()
    .duration(duration)
    .attr("d", diagonal);  
  
  // remove any exiting links.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y };
      return diagonal({source: o, target: o});
    })
    .remove();
  
  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}


// Toggle children : Set children to null, or to actual children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}
