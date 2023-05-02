// For all functions using "fetch"

// Import function from js file
import { prepareData } from "./helpers.js";

// Firebase API
const endpoint =
  "https://superhelte-network-default-rtdb.europe-west1.firebasedatabase.app/"; //husk .json

// Get all users - HTTP Method: GET
async function getUsers() {
  const response = await fetch(`${endpoint}/superheroes.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const users = prepareData(data); // convert object of object to array of objects
  return users; // return posts
}

// Create a new user - HTTP Method: POST
async function createUser(name, alias, powers, image, universe) {
  const jsObject = {
    name: name,
    alias: alias,
    powers: powers,
    universe: universe,
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
  }
  return response;
}

// Delete an existing post - HTTP Method: DELETE
async function deleteUser(id) {
  const response = await fetch(`${endpoint}/superheroes/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("deleted");
  }
  return response;
}

// Update an existing post - HTTP Method: PUT
async function updateUser(id, name, alias, powers, image, universe) {
  const userToUpdate = { name, alias, image, universe, powers };
  console.log(userToUpdate);
  const postAsJson = JSON.stringify(userToUpdate);
  const url = `${endpoint}/superheroes/${id}.json`;
  const response = await fetch(url, { method: "PUT", body: postAsJson });
  console.log(response);
  if (response.ok) {
    console.log("updated");
  }
  return response;
}
// Export functions
export { getUsers, createUser, deleteUser, updateUser };
