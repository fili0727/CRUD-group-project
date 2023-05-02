"use strict";

// import data
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "./rest-service.js";

let users;
let sortType = "normal";
// Load and init app

window.addEventListener("load", initApp);

function initApp() {
  updateUsersGrid();

  // event listener
  document
    .querySelector("#btn-create-user")
    .addEventListener("click", () =>
      document.querySelector("#dialog-create-user").showModal()
    );
  document
    .querySelector("#form-create-user")
    .addEventListener("submit", createUserClicked);

  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
  document
    .querySelector("#select-filter-by")
    .addEventListener("change", filterByChanged);
  document
    .querySelector("#select-sort-by")
    .addEventListener("change", sortByChanged);
}

// events
function inputSearchChanged(event) {
  const input = event.target.value;
  const postsToShow = searchUsers(input);
  showUsers(postsToShow);
}

function searchUsers(search) {
  search = search.toLowerCase();
  const results = users.filter(user =>
    user.alias.toLowerCase().includes(search)
  );
  return results;
}

// Users
async function updateUsersGrid() {
  users = await getUsers(); // get posts from rest endpoint and save in global variable
  showUsers(users); // show all posts (append to the DOM) with posts as argument
}

function showUsers(listOfUsers) {
  document.querySelector("#users").innerHTML = ""; // reset the content of section#posts
  listOfUsers.sort((a, b) => {
    if (a.alias.toLowerCase() < b.alias.toLowerCase()) return -1;
    else if (a.alias.toLowerCase() > b.alias.toLowerCase()) return 1;
    else return 0;
  });
  if (sortType == "reverse") {
    listOfUsers.reverse();
  }
  for (const user of listOfUsers) {
    showUser(user); // for every post object in listOfPosts, call showPost
  }
}

function showUser(userObject) {
  const html = /*html*/ `
        <article class="grid-item">
            <img src="${userObject.image}" />
             <h3>${userObject.alias}</h3>
            <h4>${userObject.name}</h4>
            <h5>Powers: ${userObject.powers}</h5>
            <h5>Universe: ${userObject.universe}</h5>
            <div class="btns">
                <button class="btn-delete navy">Delete</button>
                <button class="btn-update navy" >Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
  document.querySelector("#users").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  // add event listeners to .btn-delete and .btn-update
  document
    .querySelector("#users article:last-child .btn-delete")
    .addEventListener("click", deleteClicked);
  document
    .querySelector("#users article:last-child .btn-update")
    .addEventListener("click", updateClicked);

  // called when delete button is clicked
  function deleteClicked() {
    // console.log("Delete button clicked");
    document.querySelector("#dialog-delete-user").showModal();
    document.querySelector("#dialog-delete-user-alias").textContent =
      userObject.alias;
    document
      .querySelector("#form-delete-user")
      .setAttribute("data-id", userObject.id);
    document.querySelector("#btn-no").addEventListener("click", function () {
      document.querySelector("#dialog-delete-user").close();
    });
    document
      .querySelector("#form-delete-user")
      .addEventListener("submit", deleteUserClicked);
  }

  // called when update button is clicked
  function updateClicked() {
    // console.log("Update button clicked");
    document.querySelector("#dialog-update-user").showModal();

    document.querySelector("#alias-update").value = userObject.alias;
    document.querySelector("#name-update").value = userObject.name;
    document.querySelector("#powers-update").value = userObject.powers;
    document.querySelector("#image-update").value = userObject.image;
    document.querySelector("#select-universe-create").value =
      userObject.universe;
    document
      .querySelector("#form-update-user")
      .setAttribute("data-id", userObject.id);
    document
      .querySelector("#form-update-user")
      .addEventListener("submit", updateUserClicked);
  }
}

async function deleteUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const response = await deleteUser(id);
  if (response.ok) {
    updateUsersGrid();
    showSnackbar("User deleted");
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Something went wrong. Please, try again!");
  }
  form.reset();
  document.querySelector("#dialog-delete-user").close();
}

async function updateUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const name = form.name.value;
  const alias = form.alias.value;
  const universe = form.universe.value;
  const powers = form.powers.value;
  const image = form.image.value;

  console.log(id);
  const response = await updateUser(id, name, alias, powers, universe, image);
  if (response.ok) {
    updateUsersGrid();
    showSnackbar("User updated");
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Something went wrong. Please, try again!");
  }

  document.querySelector("#dialog-update-user").close();
}

async function createUserClicked(event) {
  event.preventDefault();
  const alias = document.querySelector("#alias-input").value;
  const powers = document.querySelector("#powers-input").value;
  const name = document.querySelector("#name-input").value;
  const universe = document.querySelector("#select-universe-create").value;
  const img = document.querySelector("#image-input").value;
  const response = await createUser(name, alias, powers, universe, img);
  if (response.ok) {
    updateUsersGrid();
    showSnackbar("User created");
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Something went wrong. Please, try again!");
  }
  const form = event.target;
  form.reset();
  document.querySelector("#dialog-create-user").close();
}
function showSnackbar(message) {
  const snackbarSelector = document.querySelector(`#snackbar`);
  snackbarSelector.textContent = `${message}`;
  snackbarSelector.classList.add("show");
  setTimeout(() => {
    snackbarSelector.classList.remove("show");
  }, 3000);
}

function filterByChanged(event) {
  const selectedValue = event.target.value;
  if (selectedValue != "") {
    const filteredUsers = users.filter(function (user) {
      return user.universe == selectedValue;
    });
    showUsers(filteredUsers);
  } else showUsers(users);
}
function sortByChanged(event) {
  if (event.target.value == "zToa") {
    sortType = "reverse";
  } else {
    sortType = "normal";
  }
  showUsers(users);
}
