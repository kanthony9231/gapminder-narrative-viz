// Define your scenes
let currentScene = 0;
const scenes = [scene1, scene2, scene3];

// Load the dataset once and reuse across scenes
d3.csv("gapminderDataFiveYear.csv").then(data => {
    console.log("CSV Loaded successfully:", data);

    data.forEach(d => {
        d.year = +d.year;
        d.lifeExp = +d.lifeExp;
        d.pop = +d.pop;
        d.gdpPercap = +d.gdpPercap;
    });

    scenes[currentScene](data);

    d3.select("#nextScene").on("click", () => {
        currentScene = (currentScene + 1) % scenes.length;
        d3.select("#visualization").html("");
        scenes[currentScene](data);
    });
})
.catch(error => {
    console.error("Error loading CSV file:", error);
});

// Scene 1: Global Life Expectancy Overview
function scene1(data) {
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 960)
        .attr("height", 600)
        .append("g")
        .attr("transform", "translate(60, 50)");

    const avgLifeExpByYear = Array.from(d3.rollup(data, 
        v => d3.mean(v, d => d.lifeExp), d => d.year), 
        ([year, lifeExp]) => ({ year, lifeExp }));

    const x = d3.scaleLinear().domain(d3.extent(avgLifeExpByYear, d => d.year)).range([0, 840]);
    const y = d3.scaleLinear().domain([30, d3.max(avgLifeExpByYear, d => d.lifeExp)]).range([500, 0]);

    svg.append("g")
        .attr("transform", "translate(0,500)")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(avgLifeExpByYear)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.lifeExp))
        );

    svg.append("text").attr("x", 400).attr("y", -20)
        .text("Global Average Life Expectancy (1952-2007)")
        .style("font-size", "18px")
        .attr("text-anchor", "middle");
}


// Scene 2: Continental Disparities
function scene2(data) {
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 960).attr("height", 600)
        .append("g").attr("transform", "translate(60, 50)");

    const continents = Array.from(new Set(data.map(d => d.continent)));

    const color = d3.scaleOrdinal().domain(continents).range(d3.schemeCategory10);
    const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, 840]);
    const y = d3.scaleLinear().domain([30, d3.max(data, d => d.lifeExp)]).range([500, 0]);

    svg.append("g")
        .attr("transform", "translate(0,500)")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g").call(d3.axisLeft(y));

    continents.forEach(continent => {
        const dataContinent = Array.from(d3.rollup(data.filter(d => d.continent === continent),
            v => d3.mean(v, d => d.lifeExp), d => d.year),
            ([year, lifeExp]) => ({ year, lifeExp }));

        svg.append("path")
            .datum(dataContinent)
            .attr("fill", "none")
            .attr("stroke", color(continent))
            .attr("stroke-width", 2)
            .attr("d", d3.line().x(d => x(d.year)).y(d => y(d.lifeExp)));

        svg.append("text")
            .attr("transform", `translate(${x(2007)+5},${y(dataContinent[dataContinent.length-1].lifeExp)})`)
            .text(continent).style("font-size", "12px").style("fill", color(continent));
    });

    svg.append("text").attr("x", 400).attr("y", -20)
        .text("Life Expectancy by Continent (1952-2007)")
        .style("font-size", "18px")
        .attr("text-anchor", "middle");
}


// Scene 3: Interactive Exploration by Country
function scene3(data) {
    const svg = d3.select("#visualization")
        .append("svg").attr("width",960).attr("height",600)
        .append("g").attr("transform","translate(80,50)");

    const latestYear = d3.max(data, d => d.year);
    const latestData = data.filter(d => d.year === latestYear);

    const x = d3.scaleLog().domain([100, d3.max(latestData, d => d.gdpPercap)]).range([0,800]);
    const y = d3.scaleLinear().domain([30,90]).range([500,0]);
    const size = d3.scaleSqrt().domain([0,d3.max(latestData,d=>d.pop)]).range([2,30]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append("g").attr("transform","translate(0,500)").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const tooltip = d3.select("body").append("div").style("opacity",0)
        .style("position","absolute").style("background","#fff").style("padding","6px")
        .style("border","1px solid #ccc").style("border-radius","4px").style("font-size","12px");

    svg.selectAll("circle").data(latestData).enter().append("circle")
        .attr("cx",d=>x(d.gdpPercap)).attr("cy",d=>y(d.lifeExp)).attr("r",d=>size(d.pop))
        .attr("fill",d=>color(d.continent)).attr("opacity",0.7)
        .on("mouseover",(event,d)=>{
            tooltip.transition().style("opacity",1);
            tooltip.html(`Country: ${d.country}<br>LifeExp: ${d.lifeExp}<br>GDP: ${d.gdpPercap.toFixed(2)}`)
                .style("left",(event.pageX+10)+"px").style("top",(event.pageY+10)+"px");
        })
        .on("mousemove",(event,d)=>{
            tooltip.style("left",(event.pageX+10)+"px").style("top",(event.pageY+10)+"px");
        })
        .on("mouseout",()=>tooltip.transition().style("opacity",0));

    svg.append("text").attr("x",400).attr("y",-20)
        .text(`Life Expectancy vs GDP per Capita (${latestYear})`)
        .style("font-size","18px").attr("text-anchor","middle");
}

