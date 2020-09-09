// Dimensions of tree diagram
const dims = { height: 500, width: 1100 };

// SVG container
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 100)
  .attr("height", dims.height + 100);

// Graph group
const graph = svg.append("g").attr("transform", "translate(0, 50)");

// Data stratify
const stratify = d3
  .stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent);

// Tree Generator
const tree = d3.tree().size([dims.width, dims.height]);

// Ordinal Scale for Colors and Grouping
const color = d3.scaleOrdinal(d3["schemeSet2"]);

// Update function to re-render the visualizations
const update = (data) => {
  // Remove current nodes
  graph.selectAll(".node").remove();
  graph.selectAll(".link").remove();

  // Updating the domains of ordinal scale
  color.domain(data.map((item) => item.dept));

  // Get updated root node data
  const rootNode = stratify(data);

  // Tree data from the tree generator
  const treeData = tree(rootNode);

  // Joining the data to the nodes
  const nodes = graph.selectAll(".node").data(treeData.descendants());

  // Joining the data to the links
  const links = graph.selectAll(".link").data(treeData.links());

  // Links Enter selection
  links
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    );

  // Enter selection (Create node groups)
  const enterNodes = nodes
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

  // Append rects to enter nodes
  enterNodes
    .append("rect")
    .attr("fill", (d) => color(d.data.dept))
    .attr("stroke", "#555")
    .attr("stroke-width", 2)
    .attr("height", 50)
    .attr("width", (d) => d.data.name.length * 20)
    .attr("transform", (d) => {
      let x = d.data.name.length * 10;
      return `translate(-${x}, -25)`;
    });

  // Append name texts to enter nodes
  enterNodes
    .append("text")
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .text((d) => d.data.name);
};

// data and firestore hook-up
let data = [];

db.collection("employees").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
