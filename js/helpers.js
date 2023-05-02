//Helper functions

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

function compareDC(post1, post2) {
  return post1.DC.localeCompare(post2.DC);
}

function compareMarvel(post1, post2) {
  return post1.Marvel.localeCompare(post2.Marvel);
}

export { prepareData };
