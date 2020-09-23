var xhr = new XMLHttpRequest();
xhr.open(
	"GET",
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
	false
);
xhr.send();

const dataset = JSON.parse(xhr.responseText).data;
const SVGwidth = 900;
const SVGheight = 400;
const padding = 50;
const barWidth = 1;

const yearDates = dataset.map(d => new Date(d[0]));
console.log(yearDates);

const xScale = d3
	.scaleLinear()
	.domain([0, barWidth * dataset.length])
	.range([0, SVGwidth - padding * 2]);

const yScale = d3
	.scaleLinear()
	.domain([d3.max(dataset, d => d[1]), 0])
	.range([SVGheight - 2 * padding, 0]);

const yScaleAxe = d3
	.scaleLinear()
	.domain([d3.max(dataset, d => d[1]), 0])
	.range([0, SVGheight - 2 * padding]);

const xScaleAxe = d3
	.scaleTime()
	.domain([
		d3.min(yearDates),
		d3.max(yearDates).setMonth(d3.max(yearDates).getMonth() + 3)
	])
	.range([0, SVGwidth - padding * 2]);

let tooltip = d3
	.select("body")
	.append("div")
	.attr("id", "tooltip")
	.style("opacity", 0);

function tooltipInfo(data) {
	let quarter = "";
	let date = new Date(data[0]);
	console.log(date.getMonth());
	switch (date.getMonth()) {
		case 0:
			quarter = "First quarter of ";
			break;
		case 3:
			quarter = "Second quarter of ";
			break;
		case 6:
			quarter = "Third quarter of ";
			break;
		case 9:
			quarter = "Fourth quarter of ";
			break;
	}
	return quarter + date.getFullYear() + "<br> GDP: $" + data[1] + " Billions";
}

svg = d3
	.select(".container")
	.append("svg")
	.attr("width", SVGwidth)
	.attr("height", SVGheight);

svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x", (d, i) => xScale(i * barWidth) + padding)
	.attr("y", d => SVGheight - yScale(d[1]) - padding)
	.attr("width", xScale(barWidth))
	.attr("height", d => yScale(d[1]))
	.attr("class", "bar")
	.attr("data-date", d => d[0])
	.attr("data-gdp", d => d[1])
	.on("mouseover", d => {
		tooltip
			.transition()
			.duration(200)
			.style("opacity", 0.9);
		tooltip
			.html(tooltipInfo(d))
			.style("left", d3.event.pageX + 10 + "px")
			.style("top", d3.event.pageY - 25 + "px")
			.attr("data-date", d[0])
	})
	.on("mouseout", () =>
		tooltip
			.transition()
			.duration(500)
			.style("opacity", 0)
	);
const xAxis = d3.axisBottom(xScaleAxe);
const yAxis = d3.axisLeft(yScaleAxe).ticks(10) //.tickFormat(item=>`\$${item/1000} B`);

svg.append("g")
	.attr(
		"transform",
		"translate(" + padding + "," + (SVGheight - padding) + ")"
	)
	.attr("id", "x-axis")
	.call(xAxis);

svg.append("g")
	.attr("transform", "translate(" + padding + ", " + padding + ")")
	.attr("id", "y-axis")
	.call(yAxis)
	
