const path = require("path");
const fetchFiles = require("./fetchTotalApplicationFiles");

module.exports = (exceptions = []) => {
  const localCommands = [];
  const commandDirs = fetchFiles(path.join(__dirname, "..", "commands"), true);

  for (const commandDir of commandDirs) {
    const commandFiles = fetchFiles(commandDir);

    for (const commandFile of commandFiles) {
      const command = require(commandFile);

      if (!exceptions.includes(command.name)) {
        localCommands.push(command);
      }
    }
  }

  return localCommands;
};
