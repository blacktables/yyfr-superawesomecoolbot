const path = require("path");
const fetchFiles = require("../utils/fetchTotalApplicationFiles");

module.exports = (client) => {
  const eventDirs = fetchFiles(path.join(__dirname, "..", "events"), true);

  for (const eventDir of eventDirs) {
    const eventFiles = fetchFiles(eventDir);
    let eventName = eventDir.replace(/\\/g, "/").split("/").pop();

    if (eventName === "validations") {
      eventName = "interactionCreate";
    }

    client.on(eventName, async (...args) => {
      for (const eventFile of eventFiles) {
        const eventHandler = require(eventFile);
        await eventHandler(client, ...args);
      }
    });
  }
};
