// Dimensions of tree diagram
const dims = { height: 500, width: 1100 };

// SVG container
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 100)
  .attr("height", dims.height + 100);

// Graph group
const graph = svg.append("g").attr("transform", "translate(50, 50)");

// Data stratify
const stratify = d3
  .stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent);

// Tree Generator
const tree = d3.tree().size([dims.width, dims.height]);

// Update function to re-render the visualizations
const update = (data) => {
  // Get updated root node data
  const rootNode = stratify(data);

  // Tree data from the tree generator
  const treeData = tree(rootNode);

  // Joining the data (Enter selection)
  const nodes = graph.selectAll(".node").data(tree.descendants());
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
