"use strict";

// import data
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "./rest-service.js";

import {} from "./helpers.js";

let users;

// Load and init app

window.addEventListener("load", initApp);

function initApp() {
  updateUsersGrid();

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

// events

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

// Users

async function updateUsersGrid() {
  users = await getUsers(); // get posts from rest endpoint and save in global variable
  showUsers(users); // show all posts (append to the DOM) with posts as argument
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

async function deleteUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  console.log(id);
  const response = await deleteUser(id);
  if (response.ok) updateUsersGrid();
  form.reset();
  document.querySelector("#dialog-delete-user").close();
}

async function updateUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const name = form.name.value;
  const alias = form.alias.value;
  const powers = form.powers.value;
  const image = form.image.value;

  console.log(id);
  const response = await updateUser(id, name, alias, powers, image);
  if (response.ok) updateUsersGrid();
  document.querySelector("#dialog-update-user").close();
}

async function createUserClicked(event) {
  event.preventDefault();

  const alias = document.querySelector("#alias-input").value;
  const powers = document.querySelector("#powers-input").value;
  const name = document.querySelector("#name-input").value;
  const img = document.querySelector("#image-input").value;
  const response = await createUser(name, alias, powers, img);
  if (response.ok) updateUsersGrid();
  const form = event.target;
  form.reset();
  document.querySelector("#dialog-create-user").close();
}
