"use strict";

// ============== global variables ============== //
const endpoint =
  "https://superhelte-network-default-rtdb.europe-west1.firebasedatabase.app/"; //husk .json

let users;

// ============== load and init app ============== //

window.addEventListener("load", initApp);

function initApp() {
  updateUsersGrid(); // update the grid of posts: get and show all posts

  // event listener
  document
    .querySelector("#btn-create-user")
    .addEventListener("click", showCreateUserDialog);
  document
    .querySelector("#form-create-user")
    .addEventListener("submit", createUserClicked);

  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
}

// ============== events ============== //

function showCreateUserDialog() {
  console.log("Create New User clicked!");
  document.querySelector("#dialog-create-user").showModal();
}

function inputSearchChanged(event) {
  const input = event.target.value;
  const postsToShow = searchUsers(input);
  showUsers(postsToShow);
}

function searchUsers(search) {
  search = search.toLowerCase();

  const results = users.filter(user =>
    user.name.toLowerCase().includes(search)
  );
  return results;
}
// to do

// ============== posts ============== //

async function updateUsersGrid() {
  users = await getUsers(); // get posts from rest endpoint and save in global variable
  showUsers(users); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
async function getUsers() {
  const response = await fetch(`${endpoint}/superheroes.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const users = prepareData(data); // convert object of object to array of objects
  return users; // return posts
}

function showUsers(listOfUsers) {
  document.querySelector("#users").innerHTML = ""; // reset the content of section#posts

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
            <p>${userObject.powers}</p>
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
    console.log("Delete button clicked");
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
    console.log("Update button clicked");
    document.querySelector("#dialog-update-user").showModal();

    document.querySelector("#alias-update").value = userObject.alias;
    document.querySelector("#name-update").value = userObject.name;
    document.querySelector("#powers-update").value = userObject.powers;
    document.querySelector("#image-update").value = userObject.image;
    document
      .querySelector("#form-update-user")
      .setAttribute("data-id", userObject.id);
    document
      .querySelector("#form-update-user")
      .addEventListener("submit", updateUserClicked);
  }
}

function deleteUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  console.log(id);
  deleteUser(id);
  form.reset();
  document.querySelector("#dialog-delete-user").close();
}

function updateUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const name = form.name.value;
  const alias = form.alias.value;
  const powers = form.powers.value;
  const image = form.image.value;

  console.log(id);
  updateUser(id, name, alias, powers, image);
  document.querySelector("#dialog-update-user").close();
}

function createUserClicked(event) {
  event.preventDefault();

  const alias = document.querySelector("#alias-input").value;
  const powers = document.querySelector("#powers-input").value;
  const name = document.querySelector("#name-input").value;
  const img = document.querySelector("#image-input").value;
  createUser(name, alias, powers, img);
  const form = event.target;
  form.reset();
  document.querySelector("#dialog-create-user").close();
}
// Create a new post - HTTP Method: POST
async function createUser(name, alias, powers, image) {
  const jsObject = {
    name: name,
    alias: alias,
    powers: powers,
    image: image,
  };
  const postAsJson = JSON.stringify(jsObject);
  console.log(`postAsJson: ${postAsJson}`);
  const response = await fetch(`${endpoint}/superheroes.json`, {
    method: "POST",
    body: postAsJson,
  });
  console.log(`response: ${response}`);
  if (response.ok) {
    console.log("new post");
    updateUsersGrid();
  }
  // create new post object
  // convert the JS object to JSON string
  // POST fetch request with JSON in the body
  // check if response is ok - if the response is successful
  // update the post grid to display all posts and the new post
}

// Update an existing post - HTTP Method: DELETE
async function deleteUser(id) {
  const response = await fetch(`${endpoint}/superheroes/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("deleted");
    updateUsersGrid();
  }
  // DELETE fetch request
  // check if response is ok - if the response is successful
  // update the post grid to display posts
}

// Delete an existing post - HTTP Method: PUT
async function updateUser(id, name, alias, powers, image) {
  const userToUpdate = { name, alias, image, powers };
  console.log(userToUpdate);
  const postAsJson = JSON.stringify(userToUpdate);
  const url = `${endpoint}/superheroes/${id}.json`;
  const response = await fetch(url, { method: "PUT", body: postAsJson });
  console.log(response);
  if (response.ok) {
    console.log("updated");
    updateUsersGrid();
  }
}

// ============== helper function ============== //

// convert object of objects til an array of objects
function prepareData(dataObject) {
  const array = []; // define empty array
  // loop through every key in dataObject
  // the value of every key is an object
  for (const key in dataObject) {
    const object = dataObject[key]; // define object
    object.id = key; // add the key in the prop id
    array.push(object); // add the object to array
  }
  return array; // return array back to "the caller"
}
