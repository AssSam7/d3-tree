// Materialize Modal init
const modal = document.querySelector(".modal");
M.Modal.init(modal);

// DOM elements
const form = document.querySelector("form");
const name = document.querySelector("#name");
const parent = document.querySelector("#parent");
const dept = document.querySelector("#dept");

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

// Remove the error messages on key events
name.addEventListener("keyup", (e) => {
  if (name.value.length > 0) {
    document.querySelector("#name + .error").textContent = "";
  } else {
    document.querySelector("#name + .error").textContent =
      "Please enter the name";
  }
});

dept.addEventListener("keyup", (e) => {
  if (dept.value.length > 0) {
    document.querySelector("#dept + .error").textContent = "";
  } else {
    document.querySelector("#dept + .error").textContent =
      "Please enter the department";
  }
});
