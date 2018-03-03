// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// Initialized axis by default
var currentAxisX = "onStamps";
var currentAxisY = "posHealth";

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth * 0.98;
    var svgHeight = window.innerHeight  * 0.98;
    var margin = {top: svgHeight * 0.09, right: svgWidth * 0.05, bottom: svgHeight * 0.2, left: 100};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate("+ margin.left + "," + margin.top +")");

    var chart = svg.append("g");

    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

    d3.csv("healthStamps.csv", function(error, healthStamps) {
        if (error) return console.warn(error);

        healthStamps.forEach(function(d) {
            d.posHealth = +d.posHealth;
            d.onStamps = +d.onStamps;
            d.offStamps = +d.offStamps;
            d.checkUp1y = +d.checkUp1y;
            d.noDiploma_25YO = +d.noDiploma_25YO;
            d.yesDiplomaNMore_25YO = +d.yesDiplomaNMore_25YO;
            //console.log("y coord: ", d[currentAxisY]);
        });
    
        // Create scale functions
        var yLinearScale = d3.scaleLinear().range([height, 0]);
        var xLinearScale = d3.scaleLinear().range([0, width]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // These variables store the minimum and maximum values in a column in data.csv
        var xMin,
            xMax,
            yMin,
            yMax;

//////////////////////////////////////////////////////////////////
// Min & Max Axis Points
//////////////////////////////////////////////////////////////////

        function findMinMaxXY(dataColumnX, dataColumnY) {
            xMin = d3.min(healthStamps, function(d) {
                return(+d[dataColumnX] * 0.85)
            });
            xMax = d3.max(healthStamps, function(d) {
                return(+d[dataColumnX] * 1.02)
            });

            yMin = d3.min(healthStamps, function(d) {
                return ((+d[dataColumnY]) * 0.95)
            });
            yMax = d3.max(healthStamps, function(d) {
                return ((+d[dataColumnY]) * 1)
            });
        }

//////////////////////////////////////////////////////////////////
// ToolTips - Labels Each Scatter Point
//////////////////////////////////////////////////////////////////

        // Create axis lines to match the default data view
        findMinMaxXY(currentAxisX, currentAxisY);
        xLinearScale.domain([xMin, xMax]);
        yLinearScale.domain([yMin, yMax]);

        // tooltip orientation & placement with respect to data points
        var tipH,
            tipV;

        tipH = 100;
        tipV = 40;

        var stamps;
        var health;
        var diploma;
        var checkup;

        // tooltip function
        var toolTip = d3.tip()
            .attr("class", "d3-tip")

            // .attr("r","15")
            .offset([tipV, tipH])
            .html(function(d) {
                var stateState = d.state;

                if ((currentAxisX === "onStamps") & (currentAxisY === "posHealth")) {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState
                        + "<br> Positive Health: <span style='color:orange'>" 
                        + ylabel
                        + "%</span><br>On Stamps: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

                else if ((currentAxisX === "offStamps" ) & (currentAxisY === "posHealth")) {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState
                        + "<br>Positive Health: <span style='color:orange'>" 
                        + ylabel
                        + "%</span><br>Off Stamps: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }
                 
                else if ((currentAxisX === "yesDiplomaNMore_25YO") & (currentAxisY === "posHealth")) {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState 
                        + "<br>Positive Health: <span style='color:orange'>" 
                        + ylabel 
                        + "%</span><br>With Diploma: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

                else if ((currentAxisX === "noDiploma_25YO") & (currentAxisY === "posHealth")) {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState 
                        + "<br>Positive Health: <span style='color:orange'>" 
                        + ylabel 
                        + "%</span><br>No Diploma: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

                else if ((currentAxisX === "onStamps") & currentAxisY === "checkUp1y") {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState
                        + "<br>Check Up Past 1 Year: <span style='color:orange'>" 
                        + ylabel
                        + "%</span><br>On Stamps: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

                else if ((currentAxisX === "offStamps") & currentAxisY === "checkUp1y") {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState
                        + "<br>Check Up Past 1 Year: <span style='color:orange'>" 
                        + ylabel
                        + "%</span><br>Off Stamps: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

                else if ((currentAxisX === "yesDiplomaNMore_25YO") & currentAxisY === "checkUp1y") {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState
                        + "<br>Check Up Past 1 Year: <span style='color:orange'>" 
                        + ylabel
                        + "%</span><br>With Diploma: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

                else if ((currentAxisX === "noDiploma_25YO") & currentAxisY === "checkUp1y") {
                    xlabel = +d[currentAxisX];
                    ylabel = +d[currentAxisY];
                    return (stateState
                        + "<br>Check Up Past 1 Year: <span style='color:orange'>" 
                        + ylabel
                        + "%</span><br>No Diploma: <span style='color:orange'>" 
                        + xlabel
                        + "%</span>");
                }

            });

        chart.call(toolTip);

//////////////////////////////////////////////////////////////////
// Data Points Plotted
//////////////////////////////////////////////////////////////////

        chart
            .selectAll("circle")
            .data(healthStamps)
            .enter().append("circle")
            .style("opacity", 0.6)
            .attr("cx", function(d) {

                // console.log("x coord: ", d[currentAxisX]);
                return xLinearScale(+d[currentAxisX]);
            })
            .attr("cy", function(d) {

                // console.log("y coord: ", d[currentAxisY]);
                return yLinearScale(+d[currentAxisY]);
            })
            .attr("r","15")
            .attr("fill", "skyblue")
            .on("click", function(d) {
                toolTip.show(d);
            })
            // on mouse out event
            .on("mouseout", function(d) {
                toolTip.hide(d);
            });

        // chart.on({
        //     "mouseover": function(d) {
        //         d3.select(this).style("cursor", "pointer"); 
        //     },
        //     "mouseout": function(d) {
        //         d3.select(this).style("cursor", "default"); 
        //     }
        // });

//////////////////////////////////////////////////////////////////
// State Labeled To Each Data Point
//////////////////////////////////////////////////////////////////

        // Appending label on each data point
        chart.append("text")
            .style("text-anchor", "middle")
            .selectAll("tspan")
            .data(healthStamps)
            .enter().append("tspan")
                .attr("x", function(d) {
                    // console.log("x coord: ", d[currentAxisX]);
                    return xLinearScale(+d[currentAxisX] - 0);
                })
                .attr("y", function(d) {
                    // console.log("y coord: ", d[currentAxisY]);
                    return yLinearScale(+d[currentAxisY] - 0.2);
                })
                .text(function(d) {return d.abbr;});

//////////////////////////////////////////////////////////////////
// X Axis - Labeling & Placement
//////////////////////////////////////////////////////////////////
        // var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";
        // Adds bottom axis line to the chart
        chart.append("g")
            .attr("transform", "translate(0,"+ height+")")
            .attr("class", "x-axis")
            .call(bottomAxis);
        
        // Adds x-axis label
        chart.append("text")
            .attr(
                "transform", 
                "translate(" + (width / 2) + " ," + (height + margin.top - 15) +")"
            )
            .attr("class", "x-axis-text active")
            .attr("x-data-axis-name", "onStamps")
            .text("On Food Stamps (%)");

        chart.append("text")
            .attr(
                "transform", 
                "translate(" + (width / 2) + " ," + (height + margin.top + 05) +")"
            )
            .attr("class", "x-axis-text inactive")
            .attr("x-data-axis-name", "offStamps")
            .text("Off Food Stamps (%)");
        
        chart.append("text")
            .attr(
                "transform", 
                "translate(" + (width / 2) + " ," + (height + margin.top + 25) +")"
            )
            .attr("class", "x-axis-text inactive")
            .attr("x-data-axis-name", "noDiploma_25YO")
            .text("Without HS Diploma (+25 YO) (%)");
        
        chart.append("text")
            .attr(
                "transform", 
                "translate(" + (width / 2) + " ," + (height + margin.top + 45) +")"
            )
            .attr("class", "x-axis-text inactive")
            .attr("x-data-axis-name", "yesDiplomaNMore_25YO")
            .text("With HS Diploma & Greater (+25 YO) (%)");

        // Adds y-axis line to the chart
        chart.append("g")
            .attr("class", "y-axis")
            .call(leftAxis);

//////////////////////////////////////////////////////////////////
// Y Axis - Labeling & Placement
//////////////////////////////////////////////////////////////////

        // Adds y-axis label
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + margin.left/4)
            .attr("x", 0 - ( height / (2) ) )
            .attr("dy", "1em")
            .attr("class", "y-axis-text active")
            .attr("y-data-axis-name", "posHealth")
            .text("Positive Health (%)");
        
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + margin.left/2)
            .attr("x", 0 - ( height / (2) ) )
            .attr("dy", "1em")
            .attr("class", "y-axis-text inactive")
            .attr("y-data-axis-name", "checkUp1y")
            .text("Past 1 Year Check Up (%)");

//////////////////////////////////////////////////////////////////
// Hide & Activate Axis Texts
//////////////////////////////////////////////////////////////////

        // Swap active/inactive data points x-axis
        function labelChangeX(clickedAxisX) {
            // Change the status of all active axes to inactive otherwise
            d3
                .selectAll(".x-axis-text")
                .filter(".active")

                // An alternative to .attr("class", <className>) method. Used to toggle classes.
                .classed("active", false)
                .classed("inactive", true);

            // Change an axis's status from inactive to active when clicked (if it was inactive)
            clickedAxisX.classed("inactive", false).classed("active", true);
        }

        // Swap active/inactive data points y-axis
        function labelChangeY(clickedAxisY) {
            // Change the status of all active axes to inactive otherwise
            d3
                .selectAll(".y-axis-text")
                .filter(".active")

                // An alternative to .attr("class", <className>) method. Used to toggle classes.
                .classed("active", false)
                .classed("inactive", true);

            // Change an axis's status from inactive to active when clicked (if it was inactive)
            clickedAxisY.classed("inactive", false).classed("active", true);
        }

//////////////////////////////////////////////////////////////////
// X Axis - Relabeled & Redrawn
//////////////////////////////////////////////////////////////////

        d3.selectAll(".x-axis-text").on("click", function() {
            // Assign a variable to current axis
            var clickedSelection = d3.select(this);

            // "true" or "false" based on whether the axis is currently selected
            var isClickedSelectionInactive = clickedSelection.classed("inactive");

            // console.log("this axis is inactive", isClickedSelectionInactive)
            // Grab the data-attribute of the axis and assign it to a variable
            // e.g. if data-axis-name is "poverty," var clickedAxisX = "poverty"
            var clickedAxisX = clickedSelection.attr("x-data-axis-name");
            console.log("current x axis: ", clickedAxisX);
        
            // The onclick events below take place only if the x-axis is inactive
            // Clicking on an already active axis will therefore do nothing
            if (isClickedSelectionInactive) {

                // Assign the clicked axis to the variable currentAxisX
                currentAxisX = clickedAxisX;

                // Call findMinAndMax() to define the min and max domain values.
                findMinMaxXY(currentAxisX, currentAxisY);

                // Set the domain for the x-axis
                xLinearScale.domain([xMin, xMax]);

                // Create a transition effect for the x-axis
                svg
                    .select(".x-axis")
                    .transition()
                    // .ease(d3.easeElastic)
                    .duration(1800)
                    .call(bottomAxis);
                    
                // Select all circles to create a transition effect, then relocate its horizontal location
                // based on the new axis that was selected/clicked
                d3.selectAll("circle").each(function() {
                    d3
                        .select(this)
                        .transition()
                        // .ease(d3.easeBounce)
                        .attr("cx", function(d) {
                            return xLinearScale(+d[currentAxisX]);
                        })
                        .attr("cy", function(d) {
                            return yLinearScale(+d[currentAxisY]);
                        })
                        .duration(1800);
                    });
                
                d3.selectAll("tspan").each(function() {
                    d3
                        .select(this)
                        .transition()
                        .attr("x", function(d) {
                            // console.log("x coord: ", d[currentAxisX]);
                            return xLinearScale(+d[currentAxisX]);
                        })
                        .attr("y", function(d) {
                            // console.log("y coord: ", d[currentAxisY]);
                            return yLinearScale(+d[currentAxisY] - 0.3);
                        })
                        .text(function(d) {return d.abbr;})
                        .duration(1800);
                })

            // Change the status of the axes. See above for more info on this function.
            labelChangeX(clickedSelection);
            }
        });

//////////////////////////////////////////////////////////////////
// Y Axis - Relabeled & Redrawn
//////////////////////////////////////////////////////////////////

        d3.selectAll(".y-axis-text").on("click", function() {
            // Assign a variable to current axis
            var clickedSelection = d3.select(this);

            // "true" or "false" based on whether the axis is currently selected
            var isClickedSelectionInactive = clickedSelection.classed("inactive");

            // console.log("this axis is inactive", isClickedSelectionInactive)
            // Grab the data-attribute of the axis and assign it to a variable
            // e.g. if data-axis-name is "poverty," var clickedAxisY = "poverty"
            var clickedAxisY = clickedSelection.attr("y-data-axis-name");
            console.log("current y axis: ", clickedAxisY);
        
            // The onclick events below take place only if the x-axis is inactive
            // Clicking on an already active axis will therefore do nothing
            if (isClickedSelectionInactive) {

                // Assign the clicked axis to the variable currentAxisX
                currentAxisY = clickedAxisY;

                // Call findMinAndMax() to define the min and max domain values.
                findMinMaxXY(currentAxisX, currentAxisY);

                // Set the domain for the y-axis
                yLinearScale.domain([yMin, yMax]);

                // Create a transition effect for the x-axis
                svg
                    .select(".y-axis")
                    .transition()
                    // .ease(d3.easeElastic)
                    .duration(1800)
                    .call(leftAxis);
                    
                // Select all circles to create a transition effect, then relocate its horizontal location
                // based on the new axis that was selected/clicked
                d3.selectAll("circle").each(function() {
                    d3
                        .select(this)
                        .transition()
                        // .ease(d3.easeBounce)
                        .attr("cx", function(d) {
                            return xLinearScale(+d[currentAxisX]);
                        })
                        .attr("cy", function(d) {
                            return yLinearScale(+d[currentAxisY]);
                        })
                        .duration(1800);
                    });
                
                d3.selectAll("tspan").each(function() {
                    d3
                        .select(this)
                        .transition()
                        .attr("x", function(d) {
                            // console.log("x coord: ", d[currentAxisX]);
                            return xLinearScale(+d[currentAxisX] - 0);
                        })
                        .attr("y", function(d) {
                            // console.log("y coord: ", d[currentAxisY]);
                            return yLinearScale(+d[currentAxisY] - 0.3);
                        })
                        .text(function(d) {return d.abbr;})
                        .duration(1800);
                })
                // Change the status of the axes. See above for more info on this function.
                labelChangeY(clickedSelection);
            }
        });
    });
}