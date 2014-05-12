/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-05-12 21:26:56
 * @version $Id$
 */
(function() {
    var mainMargin = {
        top: 20,
        right: 80,
        bottom: 150,
        left: 50
    },
        rangeMargin = {
            top: 400,
            right: 80,
            bottom: 40,
            left: 50
        },
        mainWidth = 960 - mainMargin.left - mainMargin.right,
        mainHeight = 500 - mainMargin.top - mainMargin.bottom,
        rangeHeight = 500 - rangeMargin.top - rangeMargin.bottom;

    var x = d3.scale.linear()
        .range([0, mainWidth]),
        y = d3.scale.linear()
            .range([mainHeight, 0]),
        xRange = d3.scale.linear()
            .range([0, mainWidth]), // is this necessary?
        yRange = d3.scale.linear()
            .range([rangeHeight, 0]),
        c = d3.scale.linear()
            .interpolate(d3.interpolateRgb)
            .range(["#CDC9C9", "#ff0000"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format(".0f"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .innerTickSize(0)
        .outerTickSize(0)
        .tickFormat(d3.format(",.01%"))
        .orient("left");

    var yRangeAxis = d3.svg.axis()
        .scale(yRange)
        .ticks(2)
        .innerTickSize(0)
        .outerTickSize(0)
        .tickFormat(d3.format(",.01%"))
        .orient("left");

    var svg = d3.select("#chart").append("svg")
        .attr("width", mainWidth + mainMargin.left + mainMargin.right)
        .attr("height", mainHeight + mainMargin.top + mainMargin.bottom);


    var main = svg.append("g")
        .attr("transform", "translate(" + mainMargin.left + "," + mainMargin.top + ")");

    main.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", mainWidth)
        .attr("height", mainHeight);

    var range = svg.append("g")
        .attr("transform", "translate(" + rangeMargin.left + "," + rangeMargin.top + ")");

    var overlay = main.append("rect")
        .attr("class", "overlay")
        .attr("width", mainWidth)
        .attr("height", mainHeight);

    var brush = d3.svg.brush()
        .x(xRange)
        .on("brush", brush);

    var legendContainer = svg.append("g")
        .attr("transform", "translate(" + mainMargin.left + "," + mainMargin.top + ")"),
        legendText = legendContainer.append("g"),
        legendValues = legendContainer.append("g"),
        legendLine = legendContainer.append("g");

    var bisectSeries = d3.bisector(function(d) {
        return d.x;
    }).left;

    var liner = d3.svg.line()
        .interpolate("linear")
        .defined(function(d) {
            return !isNaN(d.y);
        })
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            return y(d.y);
        });

    var rangeLine = d3.svg.line()
        .interpolate("linear")
        .defined(function(d) {
            return !isNaN(d.y);
        })
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            console.log(d.y);
            return yRange(d.y);
        });

    var area = d3.svg.area()
        .x(function(d) {
            return x(d.x);
        })
        .y0(rangeHeight)
        .y1(function(d) {
            return yRange(d.y);
        });

    d3.csv("data/worstRecovery.csv", function(error, data) {
        if (error) console.log("Error ", error);
        console.log(data)
        var m = d3.keys(data[0])
            .filter(
                function(key) {
                    return key !== "Years" && key !== "Quarters";
                });

        var series = m.map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    if (d[name]) {
                        var temp = +d[name]
                    } else {
                        var temp = NaN
                    };
                    return {
                        x: +d.Years,
                        y: temp
                    };
                })
            };
        });

        overlay
            .on("mousemove", mousemove);

        var xExtents = [0, 8]

        var yExtents = [
            d3.min(series, function(c) {
                return d3.min(c.values, function(v) {
                    return +v.y;
                });
            }),
            d3.max(series, function(c) {
                return d3.max(c.values, function(v) {
                    return +v.y;
                });
            })
        ],
            cExtents = [0, (m.length - 1)];

        x.domain(xExtents);
        y.domain(yExtents);
        xRange.domain(x.domain());
        yRange.domain(yExtents);
        c.domain(cExtents);

        main.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + mainHeight + ")")
            .call(xAxis)
            .append("text");

        main.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        range.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + rangeHeight + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 6)
            .attr("dy", "2.21em")
            .attr("x", mainWidth / 2)
            .style("text-anchor", "middle")
            .text("Years since start of recession");;

        range.append("g")
            .attr("class", "y axis")
            .call(yRangeAxis);

        range.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", rangeHeight + 7);

        var lines = main.selectAll(".lines")
            .data(series).enter()
            .append("path")
            .attr("class", "line")
            .attr("d", function(d, i) {
                console.log(d);
                return liner(d.values);
            })
            .attr("stroke", function(d, i) {
                return colourStroke(d.name, i);
            })
            .attr("stroke-width", function(d, i) {
                return (d.name === "2008 Q1" || d.name === "OBR forecast") ? "3.5px" : "2px";
            })
            .attr("stroke-dasharray", function(d, i) {
                return strokeDash(d.name);
            });

        var sumLine = range.selectAll(".rLines")
            .data([series[0]]).enter()
            .append("path")
            .attr("class", "rLine")
            .attr("d", function(d) {
                console.log(d);
                return area(d.values);
            });

        function mousemove() {

            var x0 = x.invert(d3.mouse(this)[0]),
                j = bisectSeries(series[0].values, x0),
                xT = d3.mouse(this)[0],
                xy = [{
                    x1: xT,
                    x2: xT,
                    y1: y(yExtents[1]),
                    y2: y(yExtents[0])
                }];

            var xInterceptor = legendLine.selectAll("line")
                .data(xy);

            xInterceptor.enter()
                .append("line")
                .attr("id", "xInterceptor")
                .attr("y1", function(d) {
                    return d.y1;
                })
                .attr("y2", function(d) {
                    return d.y2;
                });

            xInterceptor
                .attr("x1", function(d) {
                    return d.x1;
                })
                .attr("x2", function(d) {
                    return d.x2;
                });

            xInterceptor.exit().remove();

            var displayValues = legendValues.selectAll("text")
                .data(series);

            displayValues.enter()
                .append("text")
                .attr("x", 130)
                .attr("y", function(d, i) {
                    return yPos(i)
                });

            displayValues.text(function(d) {
                return percents(d.values[j].y);
            });

            displayValues.exit().remove();
        }
        legend(m)
    })


    function legend(data) {

        legendContainer.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", 50)
            .attr("y", function(d, i) {
                return yPos(i);
            })
            .text(function(d, i) {
                return d;
            });

        legendContainer.selectAll("line")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", 20)
            .attr("x2", 40)
            .attr("y1", function(d, i) {
                return yPos(i) - 5;
            })
            .attr("y2", function(d, i) {
                return yPos(i) - 5;
            })
            .attr("stroke", function(d, i) {
                return colourStroke(d, i);
            })
            .attr("stroke-dasharray", function(d, i) {
                return strokeDash(d);
            })

    }

    function brush() {
        x.domain(brush.empty() ? xRange.domain() : brush.extent());
        main.selectAll(".line").attr("d", function(d, i) {
            return liner(d.values);
        });
        main.select(".x.axis").call(xAxis);
    }

    function percents(x) {
        var format = d3.format(",.2%"),
            ans;

        if (!isNaN(x)) {
            ans = format(x);
        } else {
            ans = "";
        }
        return ans;
    }

    function yPos(i) {
        var ans = i * 20 + 10;
        return ans
    }

    function colourStroke(n, j) {
        var ans;
        (n === "2008 Q1" || n === "OBR forecast") ? ans = c(5) : ans = c(j);
        return ans;
    }

    function strokeDash(n) {
        return (n === "OBR forecast") ? "5,10,5" : "none";
    }

    function eachColour(ix) {
        var a = "#808080";
        var b = "#ff0000";
        ans = d3.interpolateRgb(a, b)(ix);
        return ans
    }

})()
