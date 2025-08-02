// Define your scenes
let currentScene = 0;
const scenes = [scene1, scene2, scene3];

// Load the dataset once and reuse across scenes
d3.csv("gapminderDataFiveYear.csv").then(data => {
    
    // Preprocess data if necessary here
    data.forEach(d => {
        d.year = +d.year;
        d.lifeExp = +d.lifeExp;
        d.pop = +d.pop;
        d.gdpPercap = +d.gdpPercap;
    });

    // Initially display scene 1
    scenes[currentScene](data);

    // Button listener for changing scenes
    d3.select("#nextScene").on("click", () => {
        currentScene = (currentScene + 1) % scenes.length;
        d3.select("#visualization").html(""); // Clear previous scene
        scenes[currentScene](data);
    });
});

// Scene 1: Global Life Expectancy Overview
function scene1(data) {
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 960)
        .attr("height", 600);

    svg.append("text")
        .attr("x", 480).attr("y", 300)
        .text("Scene 1: Global Life Expectancy Overview (1900-2007)")
        .attr("text-anchor", "middle")
        .style("font-size", "20px");

    // 
}

// Scene 2: Continental Disparities
function scene2(data) {
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 960)
        .attr("height", 600);

    svg.append("text")
        .attr("x", 480).attr("y", 300)
        .text("Scene 2: Continental Disparities in Life Expectancy")
        .attr("text-anchor", "middle")
        .style("font-size", "20px");

    // 
}

// Scene 3: Interactive Exploration by Country
function scene3(data) {
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 960)
        .attr("height", 600);

    svg.append("text")
        .attr("x", 480).attr("y", 300)
        .text("Scene 3: Interactive Country-Level Exploration")
        .attr("text-anchor", "middle")
        .style("font-size", "20px");

    // 
}
