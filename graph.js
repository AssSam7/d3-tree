// Dimensions of tree diagram
const dims = { height: 500, width: 1100 };

// SVG container
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 100)
  .attr("height", dim.height + 100);

// Graph group
const graph = svg.append("g").attr("transform", "translate(50, 50)");

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

  console.log(data);
});
