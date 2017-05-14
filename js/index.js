// Inspired by: using http://bl.ocks.org/mbostock/3202354 as a guide
// For: https://www.freecodecamp.com/challenges/visualize-data-with-a-heat-map
// To emulate: https://codepen.io/FreeCodeCamp/full/aNLYPp/

// set up globals
var months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    data,
    margin = {top:100,left:50,right:100,bottom:150},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    gridHeight = (height/12), // as there are 12 months in the year
    gridWidth,
    minTemp, maxTemp, baseTemp,
    firstYear, lastYear, numYears;

// set up as much as possible before data is read
var x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]);
    z = d3.scale.linear().range(["steelblue", "white", "red"]);

var xStep = 864e5,
    yStep = 100;

var svg = d3.select("body")
  .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
  .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

  // add title
  
    svg.append("text")
      .attr("class", "title")
      .attr("x", width/2)
      .attr("y", -margin.top/2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .html("Monthly Global Land Surface Temperatures (1753-2015)");



var tooltip = d3.select("body")
      .append("div")
        .attr("id","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
tooltip.append("div")
 .attr("id", "tt_ym")
 .text("Month: ")
tooltip.append("div")
  .attr("id", "tt_var")
  .text("Variance: ");
      
    

console.log(xStep);
console.log(z(0.5))

// read in the JSON
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function (error, json) {
  
  console.log("Read JSON");
  
  if(error) return console.log(error);
  
  data = json;
  
  baseTemp = data["baseTemperature"];
  minTemp = baseTemp + d3.min(data["monthlyVariance"], function(d) { return d["variance"]});
  maxTemp = baseTemp + d3.max(data["monthlyVariance"], function(d) { return d["variance"]});
  firstYear = d3.min(data["monthlyVariance"], function(d) { return d["year"]});
  lastYear = d3.max(data["monthlyVariance"], function(d) { return d["year"]});
  numYears = lastYear - firstYear;
    
  console.log(minTemp + "," + maxTemp + " from " + firstYear + " to " + lastYear + " (" + numYears + " years)");
  
  gridWidth = Math.floor(width / numYears);
  console.log("set gridWidth");
  
  // compute the scale domains
  x.domain([firstYear,lastYear]);
  y.domain([1,12]);
  z.domain([minTemp,(maxTemp-minTemp)/2,maxTemp]);
  gridHeight = y(4)-y(5);
  gridWidth = x(1901)-x(1900);
  console.log("set scales at 0.5 " + x(1900) + "," + y(5));
  
  
  
  // display each tile
  svg.selectAll(".tile")
      .data(data["monthlyVariance"])
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d["year"]); } )
      .attr("y", function(d) { return y(d["month"]); } )
      .attr("height",gridHeight)
      .attr("width",gridWidth)
      .style("fill", function(d) { return z(baseTemp + d["variance"])})
      .on("mouseover", function(d){ d3.select("#tt_ym").html("<b>Date:</b> " + months[d["month"]] + "-" + d["year"]);
                                    d3.select("#tt_var").html("<b>Variance:</b> " + d["variance"] + "&#8451;");
                                   tooltip.style("visibility", "visible");
                                   return; })
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
      
  
  // draw x axis + labels
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height+gridHeight) + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"))
    .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", margin.top/2)
      .attr("text-anchor", "middle")
      .text("Year");
  
  // draw y axis + labels
  
  var yAxis = d3.svg.axis().scale(y).orient("left");
  var ticks = [1,2,3,4,5,6,7,8,9,10,11,12];
  yAxis.tickValues(ticks)
  yAxis.tickFormat(function(d,i){ return months[i+1] });
  
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0," + (gridHeight/2) + ")")
      .call(yAxis);
    svg.append("text")
      .attr("class", "label")
      .attr("y", -30)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90), translate("+(height/-2)+",-10)")
      .text("Month");
  
  
  // add legend
    var legend = svg.selectAll(".legend")
      .data(z.ticks(6).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });

  legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", z);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svg.append("text")
      .attr("class", "label")
      .attr("x", width + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .html("Temp &#8451;");
  

  
  // draw grids
  
  console.log("finished");
  
})