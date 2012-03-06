// array of data
var data = [4, 8, 15, 16, 23, 42];

// add a div of class "chart" to the body of the document.
var chart = d3.select("body").append("svg")
  .attr("class", "chart")
  .attr("width", 440)
  .attr("height", 140)
  .append("g")
  .attr("transform", "translate(10, 15)");

var x = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([0, 10 * d3.max(data)]);

var y = d3.scale.ordinal()
  .domain(data)
  .rangeBands([0, 120]);

// tick lines
chart.selectAll("line")
  .data(x.ticks(10))
  .enter().append("line")
  .attr("x1", x)
  .attr("x2", x)
  .attr("y1", 0)
  .attr("y2", 120)
  .style("stroke", "#ccc");

// blue bars (the actual data representation)
chart.selectAll("rect").data(data).enter().append("rect")
  .attr("y", y)
  .attr("width", x)
  .attr("height", y.rangeBand());

// bar labels
chart.selectAll("text")
  .data(data)
  .enter().append("text")
  .attr("x", x)
  .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
  .attr("dx", -3)
  .attr("dy", ".35em")
  .attr("text-anchor", "end")
  .style("stroke", "#FFF")
  .text(String);

// single black line for y-axis.
chart.append("line")
  .attr("y1", 0)
  .attr("y2", 120)
  .style("stroke", "#000");

// tick labels
chart.selectAll(".rule")
  .data(x.ticks(10))
  .enter().append("text")
  .attr("class", "rule")
  .attr("x", x)
  .attr("y", 0)
  .attr("dy", -3)
  .attr("text-anchor", "middle")
  .text(String);
