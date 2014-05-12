/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2014-05-12 21:39:37
 * @version $Id$
 */
(function() {
    d3.csv("data/GovernmentSpending.csv", function(error, data) {
        if (error) console.log("The error is ", error);

        var colours = ["#CD950C", "#ff0000", "#999999"],
            format = d3.format(',.0f');

        var n = d3.keys(data[0])
            .filter(
                function(key) {
                    return key !== "Date";
                });

        var dt = [];

        data.forEach(function(d, i) {
            dt[i] = d.Date;
        });

        var xScale = d3.scale.ordinal()
            .domain([0, dt.length])
            .range(dt);

        console.log(xScale(dt[0]))

        var series = n.map(function(name, i) {
            return {
                key: name,
                color: colours[i],
                values: data.map(function(d) {
                    if (d[name]) {
                        var temp = +d[name];
                    } else {
                        var temp = 0;
                    };
                    return {
                        x: d.Date,
                        y: temp
                    };
                })
            };
        });
        console.log(series)

        var chart;
        nv.addGraph(function() {
            chart = nv.models.multiBarChart()
                .margin({
                    bottom: 100
                })
                .transitionDuration(700)
                .delay(0)
                .groupSpacing(0.1);

            chart.multibar
                .hideable(true);

            chart.reduceXTicks(false).staggerLabels(true);

            chart.xAxis;

            chart.yAxis
                .tickFormat(function(d) {
                    return "£" + format(d) + "B";
                });

            d3.select('#chart1 svg')
                .datum(series)
                .call(chart);

            nv.utils.windowResize(chart.update);

            chart.dispatch.on('stateChange', function(e) {
                nv.log('New State:', JSON.stringify(e));
            });

            return chart;
        });

    })
})()