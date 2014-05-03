(function(){
var w = 700,
   h = 700,
   r1 = h / 2,
   r0 = r1 - 75;

var fill = d3.scale.ordinal()
     .domain(d3.range(14))
     .range(["#aec7e8", "#aec7e8", "#aec7e8", "#aec7e8", "#aec7e8", "#1f77b4", "#1f77b4", "#98df8a", "#98df8a", "#98df8a", "#98df8a"]);
 
var chord = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()
    .innerRadius(r0)
    .outerRadius(r0 + 15);

var svg = d3.select("#chord").insert("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

var WRmatrix =     ([
  [0,6,25,0,0,4,1,10,1,0,6],
  [6,0,17,15,5,16,18,17,8,5,15],
  [25,17,0,8,25,12,12,16,4,11,15],
  [0,15,8,0,18,0,0,2,5,1,13],
  [0,5,25,18,0,0,0,12,6,7,20],
  [4,16,12,0,0,0,14,4,6,3,15],
  [1,18,12,0,0,14,0,20,6,20,6],
  [10,17,16,2,12,4,20,0,2,12,8],
  [1,8,4,5,6,6,6,2,0,2,4],
  [0,5,11,1,7,3,20,12,2,0,4],
  [6,15,15,13,20,15,6,8,4,4,0]
     ]);
 
 var nameCat = ([ "Flooding",  "Stormwater Quality",  "Cost",  "Demand",  "Wastewater Volume",  "Aesthetics",  "Biodiversity",  "Hydrological Regime", "Urban Heat Island", "Supply Security", "Waterway Health" ]);

 
chord.matrix(WRmatrix);

var g = svg.selectAll("g.group")
      .data(chord.groups)
    .enter().append("svg:g")
      .attr("class", "group")
      .on("mouseover", fade(.10))
      .on("mouseout", fade(.80));

  g.append("svg:path")
      .attr("id", function(d, i) { return "group" + i; })
      .style("stroke", function(d) { return fill(d.index); })
      .style("fill", function(d) { return fill(d.index); })
      .attr("d", arc);

var gtext = g.append("svg:text")
      .attr("x", 6)
      .attr("dy", -24);

  gtext.append("textPath")
      .attr("xlink:href", function(d, i) { return "#group" + i; })
      .text(function(d) { return nameCat[d.index]; });

  svg.selectAll("path.chord")
      .data(chord.chords)
    .enter().append("svg:path")
      .attr("class", "chord")
      .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
      .style("fill", function(d) { return fill(d.source.index); })
      .attr("d", d3.svg.chord().radius(r0));

// Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(d, i) {
    svg.selectAll("path.chord")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
      .transition()
        .style("stroke-opacity", opacity)
        .style("fill-opacity", opacity);
  };
}
})();