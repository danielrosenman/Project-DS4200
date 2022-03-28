const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read the data
var parseDate = d3.timeParse("%Y-%m-%d")
d3.csv('data/data.csv', function(d) {
  return {
    Date: parseDate(d.Date),
    count: d.count
  };
}).then(function(data) {
   console.log(data);
   const allGroup = ["week", "month", "semester", "6 months", "year"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);


  let maxdate = d3.max(data, function(d){return d.Date;});
  let mindate = d3.min(data, function(d){return d.Date;});
  let maxcount = d3.max(data, function(d){return d.count;});
  console.log(maxdate, mindate, maxcount);

  // Add X axis
  const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.Date; }))
    .range([ 0, width ])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.count; }))
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Date) })
      .y(function(d) { return y(d.count) })
      )

  // svg.selectAll("rect")
  //   .data(data)
  //   .enter()
  //   .append("rect")
  //     .attr("x", d => x(d.Date))
  //     .attr("y", d => y(d.count))
  //     .attr("width", x.bandwidth())
  //     .attr("height", d => height - y(d.count))
  //     .attr("fill", "#69b3a2")

  // d3.select("#selectButton").on("change", function(event,d) {
  //       // recover the option that has been chosen
  //       const selectedOption = d3.select(this).property("value")
  //       // run the updateChart function with this selected option
  //       update(selectedOption)
  //   })
  // function update(selectedGroup) {

  //     // Create new data with the selection?
  //   const dataFilter = data.map(function(d){return {Date: d.Date, value:d[selectedGroup]} })

  //     // Give these new data to update line
  //   line
  //       .datum(dataFilter)
  //       .transition()
  //       .duration(1000)
  //       .attr("d", d3.line()
  //         .x(function(d) { return x(+d.time) })
  //         .y(function(d) { return y(+d.value) })
  //        )
  //        .attr("stroke", function(d){ return myColor(selectedGroup) })
  //   }


})

