function chordVis(matrix, background, type){
var w = 650,
   h = 650,
   r1 = (h +10) / 2,
   r0 = r1 - 50;
 
var chord = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()
    .innerRadius(r0)
    .outerRadius(r0 + 15);

var svg = d3.select("#chord_"+type).insert("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

d3.text(matrix, function(csv) {
  var rows = d3.csv.parseRows(csv);
  var matrix = [];

  for (var i = 0; i < rows.length; i++) {
    matrix[i] = rows[i];
    for (var j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = +matrix[i][j];   
    };
  }; 

  d3.csv(background, function(background) {
 
    chord.matrix(matrix);

    var temp = d3.select("#svgTemp2").insert("svg")
                  .attr("id","svg_"+type)

      //create a svg block to place dummy text in, that is required due to display: none in Stack css
      d3.select("#svg_"+type).selectAll("text")
          .data(background)
      .enter().append("text")
          .text(function(d,i) { return d.name; })
          .attr("id", function(d,i) { return type+d.name; });

    var g = svg.selectAll("g.group")
        .data(chord.groups)
      .enter().append("svg:g")
        .attr("class", "group")
        .style("opacity", function(d,i) { console.log(d); return 0.8; })
        .on("mouseover", fade(.10))
        .on("mouseout", fade(.80));

    g.append("svg:path")
        .attr("id", function(d, i) { return "group_" + type + i; })
        .style("stroke", function(d) { return background[d.index].colour; })
        .style("fill", function(d) { return background[d.index].colour; })
        .attr("d", arc);

  var gtext = g.append("svg:text")
        .attr("x", 6)
        .attr("dy", -12);

    gtext.append("textPath")
        .attr("method", "stretch")
        .attr("spacing", "auto")
        .attr("xlink:href", function(d, i) { return "#group_"+ type + i; })
        .text(truncateText(function(d) { return background[d.index].name; }));  //function(d) { return background[d.index].name; }

    gtext.append("title")
        .text(function(d) { return background[d.index].name; });

  var chordpath = svg.selectAll("path.chord")
        .data(chord.chords)
      .enter().append("svg:path")
        .attr("class", "chord")
        .style("stroke", function(d) { return d3.rgb(background[d.source.index].colour).darker(); })
        .style("fill", function(d) { return background[d.source.index].colour; })
        .attr("d", d3.svg.chord().radius(r0));

    chordpath.append("title").text(function(d)  {
          return background[d.source.index].name
          + " → " + background[d.target.index].name; });

    function truncateText(text) {
  
    return function(d, i) {

      var t = this.textContent = text(d, i)
          w = r0 * (d.endAngle - d.startAngle);
          d.name = t;

      var ct = document.getElementById(type+d.name)
  
      if (ct.getComputedTextLength() < w) {return t; };
      
      this.textContent = "…" + t;

      var lo = 0,
          hi = t.length 
         
      while (lo < hi) {
        var mid = lo + hi >> 1;
        if ((ct.getSubStringLength(0, mid)) < w) lo = mid + 1;
        else hi = mid;
      }
  
      return lo > 1 ? t.substr(0, lo - 4) + "…" : "";
   
    };
    
  }
    
  // Returns an event handler for fading a given chord group.
  function fade(opacity) {
    return function(d, i) {
      svg.selectAll("path.chord")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
        .transition()
          .style("stroke-opacity", opacity)
          .style("fill-opacity", opacity);
      };
    };
    
  });

  });
};