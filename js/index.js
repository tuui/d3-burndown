$(function () {
    initChart();
});

function initChart() {

    let days = ['E', 'T', 'K', 'N', 'R', 'E', 'K', 'N', 'R'];

    let availableHours = 200;
    let plannedHours = 154;

    let availableDays = days.length - 1; //   starts with 0
    let plannedDays = calculatePlannedDays(plannedHours, availableHours, availableDays);

    let lineDataAvailable = [{'x': 0, 'y': availableHours}, {'x': availableDays, 'y': 0}];
    let lineDataPlanned = [{'x': 0, 'y': plannedHours}, {'x': plannedDays, 'y': 0}];

    let lineDataActual = [{
        'x': 0,
        'y': plannedHours
    }, {
        'x': 1,
        'y': 130
    }, {
        'x': 2,
        'y': 120
    }, {
        'x': 3,
        'y': 80
    }, {
        'x': 4,
        'y': 65
    }, {
        'x': 5,
        'y': 45
    }, {
        'x': 6,
        'y': 70
    }, {
        'x': 7,
        'y': 20
    }];

    let svg = d3.select("#visualisation"),
        width = 1000,
        height = 500,
        margins = {
            top: 80,
            right: 50,
            bottom: 80,
            left: 80
        },

        xRange = d3.scaleLinear()
            .range([margins.left, width - margins.right])
            .domain([0, availableDays]),

        yRange = d3.scaleLinear()
            .range([height - margins.top, margins.bottom])
            .domain([0, calculateMaxY(plannedHours, availableHours)]),

        xAxis = d3.axisBottom(xRange).ticks(availableDays).tickFormat(function (d) {
            return days[d]
        }),
        yAxis = d3.axisLeft(yRange);

    let lineFunc = d3.line()
        .x(function (d) {
            return xRange(d.x);
        })
        .y(function (d) {
            return yRange(d.y);
        })
        .curve(d3.curveNatural);

    function generateAxisX() {
        return d3.axisBottom(xRange)
    }

    function generateAxisY() {
        return d3.axisLeft(yRange)
    }

    function calculateMaxY(plannedHours, availableHours) {
        if (plannedHours > availableHours) {
            return plannedHours;
        }
        return availableHours;
    }

    function calculatePlannedDays(plannedHours, availableHours, availableDays) {
        if (plannedHours > availableHours) {
            return availableDays;
        }
        return plannedHours * availableDays / availableHours;
    }

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + (height - margins.top) + ")")
        .call(generateAxisX()
            .tickSize((-height) + (margins.top + margins.bottom), 0, 0)
            .tickFormat("")
        );

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + (margins.left) + ",0)")
        .call(generateAxisY()
            .tickSize((-width) + (margins.right + margins.left), 0, 0)
            .tickFormat("")
        );

    svg.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - (margins.bottom)) + ")")
        .call(xAxis);

    svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margins.left) + ",0)")
        .call(yAxis);

    svg.append("svg:path")
        .attr("d", lineFunc(lineDataAvailable))
        .attr("class", "available");

    svg.append("svg:path")
        .attr("d", lineFunc(lineDataPlanned))
        .attr("class", "planned");

    svg.append("svg:path")
        .attr("d", lineFunc(lineDataActual))
        .attr("class", "actual")
    ;

    svg.selectAll(".dot")
        .data(lineDataActual)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return xRange(i) + 5
        })
        .attr("y", function (d) {
            return yRange(d.y) - 5
        })
        .text(function (d) {
            return d.y;
        })

    // svg.append("text")
    //     .attr("class", "x label")
    //     .attr("text-anchor", "end")
    //     .attr("x", width)
    //     .attr("y", height - 6)
    //     .text("Days");
    //
    // svg.append("text")
    //     .attr("class", "y label")
    //     .attr("text-anchor", "end")
    //     .attr("y", 6)
    //     .attr("dy", ".75em")
    //     .attr("transform", "rotate(-90)")
    //     .text("Hours remaining");


}