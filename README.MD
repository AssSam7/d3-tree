<h1 align="center">Hierarchical Tree 🎄</h1>
<p align="center">
  <img src="https://img.shields.io/badge/materialize-v1.0-ff69b4">
  <img src="https://img.shields.io/badge/D3.js-v5-important">
  <img src="https://img.shields.io/badge/firebase-v7.19.0-yellow">
</p>

> This application is a visualization tool which helps the users to render a tree based on the data feed. It idenitifies the hierarchy in the data based on few parameters like 'parent' and 'dept' etc.

## Demo 🪁

https://objective-minsky-1384e5.netlify.app/

## Tech Stack 👩‍💻

- 🌈 Materialize CSS
- 🟨 Javascript (ES6+)
- 🖋️ D3.JS
- 🗃️ Firebase (Firestore)

## Getting Started 🚀

### 1. D3.js CDN

Add the following **CDN** at the end of the **body** tag in the **index.html**

```html
<script src="https://d3js.org/d3.v5.js"></script>
```

### 2. Firebase CDN

Get the below code from console.firebase.google.com and check out, Adding this project to the web app

```html
<script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-firestore.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDQQN1E2V8K8wFqjHKiSjimAHvjagZst0k",
    authDomain: "d3-firebase-starter.firebaseapp.com",
    databaseURL: "https://d3-firebase-starter.firebaseio.com",
    projectId: "d3-firebase-starter",
    storageBucket: "d3-firebase-starter.appspot.com",
    messagingSenderId: "1020387918909",
    appId: "1:1020387918909:web:508221bf07b68bc2079654",
    measurementId: "G-XJ376VQ9BE",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
</script>
```

## Opening the modal (Materialize-css) 📖

When the add button is clicked, a modal is opened with the form to submit the details to firestore

```javascript
const modal = document.querySelector(".modal");
M.Modal.init(modal);
```

## User Interactions 🤝

Making the application interactive and managing the data back and forth.

### DOM Elements

These are the DOM elements through which the data is send to the back-end. In our form there are 3 fields

- Name (Name identifier)
- Parent (Parent identifier)
- Dept (Department corresponding to)

```javascript
const form = document.querySelector("form");
const name = document.querySelector("#name");
const parent = document.querySelector("#parent");
const dept = document.querySelector("#dept");
```

### Submitting the form

When the user submits the form, prevent few default actions and send the data to the firestore

```javascript
form.addEventListener("submit", (e) => {
  // Prevent default
  e.preventDefault();

  // Form Validations
  if (name.value && dept.value) {
    // Store the data in the firestore
    db.collection("employees").add({
      name: name.value,
      parent: parent.value,
      dept: dept.value,
    });

    let instanceOfModal = M.Modal.getInstance(modal);
    instanceOfModal.close();

    // Reset the form
    form.reset();
  }
});
```

## Error Messages

Handling the form when no data is entered by adding the **key** event listeners to the corresponding fields and showing the error messages

**Name field**

```javascript
name.addEventListener("keyup", (e) => {
  if (name.value.length > 0) {
    document.querySelector("#name + .error").textContent = "";
  } else {
    document.querySelector("#name + .error").textContent =
      "Please enter the name";
  }
});
```

**Dept field**

```javascript
dept.addEventListener("keyup", (e) => {
  if (dept.value.length > 0) {
    document.querySelector("#dept + .error").textContent = "";
  } else {
    document.querySelector("#dept + .error").textContent =
      "Please enter the department";
  }
});
```

## Real-time data updates ⌛

We can use **onSnapshot()** method of the firestore. This method accepts a call-back as an argument with **res** as its parameter.

1. Apply this method on our collection where the data is stored
2. There are 3 cases of data alteration in firestore
   - **Added**: When a new document is added to the collection.
   - **Modified**: When an existing document properties are altered or new properties are added to an existing document.
   - **Deleted**: When an existing document is deleted.

```javascript
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
```

## Metrics 📏

The dimensions of the tree diagram and the SVG canvas

### 1. Dimensions of Tree

```javascript
const dims = { height: 500, width: 1100 };
```

### 2. Appending the SVG to canvas

```javascript
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 100)
  .attr("height", dim.height + 100);
```

### 3. Creating the graph group

Append the graph group to the SVG and transform i.e. move the graph 50 in the each direction so that it has some room to breathe

```javascript
const graph = svg.append("g").attr("transform", "translate(50, 50)");
```

## Drawing the Tree ✏️

Create the graph and update the visualizations

### 1. Data stratify

We need to segregate the data based on the identifiers and parents, stratify is used for this purpose

```javascript
const stratify = d3
  .stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent);
```

### 2. Creating the update function

Update function to re-render the visualizations

```javascript
const update = (data) => {
  // Get updated root node data
  const rootNode = stratify(data);
  ...
  ...
};
```

### 3. Tree generator

Using the tree generator to generate the tree diagram based on the dimensions

**Creating the tree generator**

```javascript
const tree = d3.tree().size([dims.width, dims.height]);
```

**Passing the data**

```javascript
const treeData = tree(rootNode);
```

### 4. Joining the data

Till this point nothing is being added to the DOM to render the tree, firstly joining the data to get the enter and exit selections. We use the **descendants()** method to convert the **Node** object to an **array** which is the only acceptable format of **data()**

```javascript
const nodes = graph.selectAll(".node").data(treeData.descendants());
```

### 5. Enter selection

Transform the nodes based on the **x** and **y** positions generated by the tree generator

**Appending the groups**

```javascript
const enterNodes = nodes
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
```

**Appending the rects to enter nodes**

Here we determine the width of each node based on length of the name

```javascript
enterNodes
  .append("rect")
  .attr("fill", "#aaa")
  .attr("stroke", "#555")
  .attr("stroke-width", 2)
  .attr("height", 50)
  .attr("width", (d) => d.data.name.length * 20);
```

**Appending the text elements to enter nodes**

```javascript
enterNodes
  .append("text")
  .attr("text-anchor", "middle")
  .attr("fill", "#fff")
  .text((d) => d.data.name);
```

### 6. Links enter selection

To fulfill the purpose of a tree, it needs to have some connections links from one node to another

**Joining the data to the links**

We use links() method to convert the data to the form which generates the paths of drawing the links

```javascript
const links = graph.selectAll(".link").data(treeData.links());
```

**Appending the paths**

Above joined data add the **x** and **y\*** co-ordinates required for the path elements drawn through **d3.linkVertical()**

```javascript
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
```

## Node positions 🪑

Current rects positions needs to translated based on the text (name). Move half-way top and move half way left based on the text length

```javascript
.attr("transform", (d) => {
  let x = d.data.name.length * 10;
  return `translate(-${x}, -25)`;
})
```

## Re-Rendering Visualizations 💫

Once the new nodes are added, the current paths needs to re-calculated and drawn coercively. For this app, re-calculating all the positions is bit tricky hence we can remove the **rects** and **links** every time the **update()** function is triggered. This makes the re-draw and no complex issues are raised

```javascript
graph.selectAll(".node").remove();
graph.selectAll(".link").remove();
```

## Coloring and Grouping 🌈

We can color the nodes based on departments. Using an ordinal scale, we can pass a **range** of **colors** with **domain** of **depts** and fill the **rects** based on the **departments**.

**Creating the ordinal scale**

We can use a range of values or any scheme set for random colors

```javascript
const color = d3.scaleOrdinal(d3["schemeSet2"]);
```

**Passing the domains on update**

Depts needs to be based as the domain of the ordinal scale

```javascript
color.domain(data.map((item) => item.dept));
```

**Using the ordinal scale**

Changing the color of rects by passing them through ordinal scale and giving the particular dept name

```javascript
.attr("fill", (d) => color(d.data.dept))
```

## Contributor ✨

- Twitter : [@malsaslam97](https://twitter.com/malsaslam97)
- Github: [@AssSam7](https://github.com/AssSam7)
- LinkedIn: [Aslam Mohammed](https://www.linkedin.com/in/malsaslam97/)

## Show your support

Give a ⭐️ if you feel this application has some credibility
