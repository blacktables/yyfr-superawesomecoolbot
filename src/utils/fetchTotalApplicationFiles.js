const fs = require("fs");
const path = require("path");

module.exports = (directory, foldersOnly = false) => {
  const fileNames = [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (foldersOnly) {
      if (entry.isDirectory()) {
        fileNames.push(entryPath);
      }
    } else {
      if (entry.isFile()) {
        fileNames.push(entryPath);
      }
    }
  }

  return fileNames;
};
