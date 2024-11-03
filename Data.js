// The data is hardcoded because parsing the csv file was not working
const data = {
    nodes: [
        { name: "Domestic Revenue"},
        { name: "Local Government Revenue"},
        { name: "Project Support (External Financing)"},
        { name: "Petroleum Fund Drawdown"},
        { name: "Domestic Refinancing of Maturing debt"},
        { name: "Treasury Bonds for settlement"},
        { name: "Domestic Borrowing"},
        { name: "Budget Support"},
        { name: "Budget"},
        { name: "External Project Financing" },
        { name: "Security Good Governance and Rule of Law"},
        { name: "Non-wage Recurrent Expenditure" },
        { name: "others" },
        { name: "Agriculture"},
        { name: "Education" },
        { name: "Health" },
        { name: "External Debt Repayment" },
        { name: "Industrial Development and Manufacturing" },
        { name: "Development Expenditure from own resources"  },
        { name: "Wages and Salaries"  }
    ],
    links: [
        { source: 0, target: 8, value: 31.98},
        { source: 1, target: 8, value: 0.29},
        { source: 2, target: 8, value: 9.58},
        { source: 3, target: 8, value: 0.12},
        { source: 4, target: 8, value: 12.02},
        { source: 5, target: 8, value: 7.78},
        { source: 6, target: 8, value: 8.97},
        { source: 7, target: 8, value: 1.39},
        { source: 8, target: 9, value: 9.58 },
        { source: 8, target: 10, value: 9.59 },
        { source: 8, target: 11, value: 17.45 },
        { source: 8, target: 12, value: 2.61 },
        { source: 8, target: 13, value: 1.88 },
        { source: 8, target: 14, value: 2.50 },
        { source: 8, target: 15, value: 2.95 },
        { source: 8, target: 16, value: 3.15 },
        { source: 8, target: 17, value: 4.99 },
        { source: 8, target: 18, value: 6.15 },
        { source: 8, target: 19, value: 7.93 }
    ]
};

// Set up dimensions
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// The custom color scale
const customColors = {
    "Budget": "#1f77b4", 
    // Source nodes (left side)
    "Domestic Revenue": "#ff7f0e",
    "Local Government Revenue": "#2ca02c",
    "Project Support (External Financing)": "#d62728",
    "Petroleum Fund Drawdown": "#9467bd",
    "Domestic Refinancing of Maturing debt": "#8c564b",
    "Treasury Bonds for settlement": "#e377c2",
    "Domestic Borrowing": "#7f7f7f",
    "Budget Support": "#bcbd22",
    // Target nodes (right side)
    "External Project Financing": "#17becf",
    "Security Good Governance and Rule of Law": "#aec7e8",
    "Non-wage Recurrent Expenditure": "#ffbb78",
    "others": "#98df8a",
    "Agriculture": "#ff9896",
    "Education": "#c5b0d5",
    "Health": "#c49c94",
    "External Debt Repayment": "#f7b6d2",
    "Industrial Development and Manufacturing": "#c7c7c7",
    "Development Expenditure from own resources": "#dbdb8d",
    "Wages and Salaries": "#9edae5"
};

const colorScale = d => customColors[d] || "#666666"; // Fallback color if node name not found


const svg = d3.select("#sankey")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(20)
    .extent([[0, 0], [width, height]]);


const { nodes, links } = sankey(data);


const defs = svg.append("defs");


links.forEach((link, i) => {
    const gradientId = `gradient-${i}`;
    const sourceColor = colorScale(link.source.name);
    const targetColor = colorScale(link.target.name);
    
    const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", link.source.x1)
        .attr("x2", link.target.x0);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", sourceColor);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", targetColor);
});


const link = svg.append("g")
    .selectAll(".link")
    .data(links)
    .join("path")
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d, i) => `url(#gradient-${i})`)
    .attr("stroke-width", d => Math.max(1, d.width))
    .style("fill", "none")
    .style("opacity", 0.5);


const node = svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);


node.append("rect")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.name))
    .style("opacity", 0.8);


node.append("text")
    .attr("x", d => (d.x0 < width / 2) ? 6 + (d.x1 - d.x0) : -6)
    .attr("y", d => (d.y1 - d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => (d.x0 < width / 2) ? "start" : "end")
    .text(d => d.name)
    .style("font-size", "12px")
    .style("font-weight", "500");


link
    .append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toFixed(2)}`);


link
    .on("mouseover", function() {
        d3.select(this)
            .style("opacity", 0.8);
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("opacity", 0.5);
    });

node
    .on("mouseover", function() {
        d3.select(this).select("rect")
            .style("opacity", 1);
    })
    .on("mouseout", function() {
        d3.select(this).select("rect")
            .style("opacity", 0.8);
    });