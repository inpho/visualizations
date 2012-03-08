var w = 960;
var h = 2000;
var root;

var tree = d3.layout.tree()
  .size([h, w - 160]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

var vis = d3.select("#chart").append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("g")
  .attr("transform", "translate(40, 0)");

d3.json("../../data/inpho.json", function(json) {

  root = json;
  // Code removed
  // Set initial x0 and y0 of root. 

  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

  // Code removed.  Initialized some nodes to be expanded.
  update(root);
});

function update(source) {
  var nodes = tree.nodes(root).reverse(); // Why reversed?

  var link = vis.selectAll("path.link")
    .data(tree.links(nodes))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", diagonal);
  
  
  var node = vis.selectAll("g.node")
    .data(nodes);

  // Enter in any newfound nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    })
    .on("click", function(d) {
      toggle(d);
      update(d);
    });

  // Draw a circle for each newly-found node.
  nodeEnter.append("circle")
    .attr("r", 4.5);

  // Draw a label for each newly-found node.
  nodeEnter.append("text")
    .attr("dx", function(d) { return d.children || d._children ? -8 : 8; })
    .attr("dy", 3)
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; }) // this looks like a bug (in our json): all labels are to the left, implying that all nodes have children, even if it's the empty list.
    .text(function(d) { return d.name; });

  // remove any exiting nodes.
  var nodeExit = node.exit().remove();
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
