var chart = $("#chart"),
    chart_title = $("#chart_title"),
    iter = 0,
    count = 0,
    margin = {top: 80, right: 80, bottom: 10, left: 80},
    width = parseInt(chart.css("width"))* 0.75,
    height = 800 * 0.8, // parseInt(chart.css("height"))
    init = Array.apply(null, {length: 10}).map(Number.call, Number);

var svg = d3.select("#chart").append("svg")
        .attr("width", width + 100)
        .attr("height", height + 100)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var band = d3.scaleBand()
        .domain(init)
        .range([0, width])
        .padding(.05),
    yband = d3.scaleBand()
        .domain(init)
        .range([0, height])
        .padding(0.05),
    colorMap = d3.scaleLinear()
        .range([0,1])
        .clamp(true);

var ylabel = svg.selectAll(".label")
    .data(init)
        .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return band(i); })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + band.bandwidth() / 2 + ", -6)")
            .attr("class", "ylabel");


var ytitle = svg.selectAll("svg")
    .data(["Target Data"])
        .enter().append("text")
            .text(function(d) {return d;})
            .attr("x", band(4) + band.bandwidth() / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + band.bandwidth() / 2 + ", -6)")
            .attr("class", "h4");


var xtitle = svg.selectAll("svg")
    .data(["Features"])
    .enter().append("text")
    .text(function(d) {return d;})
    .attr("x", -yband(5) - yband.bandwidth() / 2)
    .attr("y", -80)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + yband.bandwidth() / 2 + ", -6) rotate(-90)")
    .attr("class", "h4");


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var plotHeatMap = function(csv) {
    d3.csv(csv, function (data) {
        chart_title.html("Iteration #0");
        data.forEach(function (d) {
            d.row = +d.row;
            d.col = +d.col;
            d.weight = +d.weight;
        });

        band.domain(data.map(function (d) {
            if(d.row == 0) {count += 1;} //getting total number elements in a row
            return d.row;
        }));

        yband.domain(data.map(function (d) {
            return d.col;
        }));

        colorMap.domain([0, d3.max(data, function (d) {
            return Math.abs(d.weight)
        })]);

        var heatMap = svg.append("g")
            .selectAll()
            .data(data, function (d) {
            })
            .enter()
            .append("rect")
                .attr("x", function (d) {
                    return band(d.row);
                })
                .attr("y", function (d) {
                    return yband(d.col);
                })
                .attr("width", band.bandwidth())
                .attr("height", yband.bandwidth())
                .attr("class", "cell")
                .style("fill", d3.interpolateCool(0))
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);

                    div.html("x:" + d.row + " y:" + d.col + "\n" + colorMap(Math.abs(d.weight)).toFixed(4))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });


        heatMap.transition()
            .duration(1000)
            .style("fill", function (d) {
                return d3.interpolateCool(colorMap(Math.abs(d.weight)));
            })


    });
};

var updateHeatMap = function(iter) {
    chart_title.html("Iteration #" + iter);
    d3.csv(chart.attr("data-url").slice(0, -5) + iter + ".csv", function (data) {
        colorMap.domain([0, d3.max(data, function (d) {
            return Math.abs(d.weight)
        })]); // normalize data

        var trans = svg.transition()
            .duration(1000)
            .selectAll(".cell")
            .style("fill", function (d) {
                return d3.interpolateCool(colorMap(Math.abs(data[d.row * count + d.col].weight)));
            })
    });
};

plotHeatMap(chart.attr("data-url")); //initial plot

d3.select("#next").on("click", function(d) {
    if(iter < 9) {
        iter += 1;
        updateHeatMap(iter);
    }
});

d3.select("#previous").on("click", function(d) {
    if(iter > 0) {
        iter -= 1;
        updateHeatMap(iter);
    }
});

var legend = svg.selectAll(".legend")
    .data(init)
    .enter()
    .append("g")
        .attr("class", "legend");

legend.append("rect")
    .attr("x", function(d, i) { return width - width * 0.3 + width * 0.03 * i; })
    .attr("y", -50)
    .attr("width", width * 0.03)
    .attr("height", width * 0.02)
    .style("fill", function(d, i) { return d3.interpolateCool(i / 10); });

legend.append("text")
    .attr("class", "legendtext")
    .text(function(d, i) { return init[i] / 10; })
    .attr("x", function(d, i) { return width - width * 0.3 + width * 0.03 * i; })
    .attr("y", -55);

svg.append("text")
    .attr("class", "label")
    .attr("x", width - width * 0.03 * 6)
    .attr("y", -70)
    .attr("dy", ".35em")
    .text("Weight");

