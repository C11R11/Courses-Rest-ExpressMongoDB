import fs from "fs";

/**
 * This script will copy the test data-json to the app data
 * The idea is to make the test as clean as possible.
 * 
 * debt: Restore the app data back
 */
fs.copyFile("./test/data/test-data.json", "./data/albums.json", (err) => {
  if (err) {
    console.log("Error Found:", err);
  } else {
    console.log("File copied");
    let originalData = JSON.parse(fs.readFileSync("data/albums.json").toString());
    console.log("original data->", originalData.length);
  }
});

