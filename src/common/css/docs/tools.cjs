const fs = require('fs');
const path = require('path');

const capitalizeFirstLetter = (inputString) =>
  inputString.charAt(0).toUpperCase() + inputString.slice(1);

// Define the template content
const template = `---
layout: "../../layouts/Page.astro"
title: "FILENAME"
description: "Usage on how to use FILENAME"
updatedAt: "August 08 2022"
---

Hi from FILENAME`;

// Define the root folder to start the search
const rootFolder = './src/pages'; // Change this to the root folder you want to start from

// Function to recursively process folders and files
function processFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If it's a directory, recursively process it
      processFolder(filePath);
    } else if (stats.isFile() && path.extname(file) === '.mdx') {
      // If it's a file with a .txt extension, read and modify its content
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const updatedContent = template.replace(
        /FILENAME/g,
        capitalizeFirstLetter(path.basename(file, '.mdx')),
      );

      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated: ${filePath}`);
    }
  });
}

// Start processing the root folder
processFolder(rootFolder);
