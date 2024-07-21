require("colors");

const checkCommands = require("../../utils/checkCommands");
const getApplicationCommands = require("../../utils/fetchTotalApplicationCommands");
const getLocalCommands = require("../../utils/fetchLocalCommands");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client);

    for (const localCommand of localCommands) {
      const {
        name: commandName,
        description: commandDescription,
        options: commandOptions,
        deleted: commandDeleted,
      } = localCommand.data;

      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === commandName
      );

      if (existingCommand) {
        if (commandDeleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(
            `Application command ${commandName} has been deleted.`.red
          );
        } else if (checkCommands(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            name: commandName,
            description: commandDescription,
            options: commandOptions,
          });
          console.log(
            `Application command ${commandName} has been modified.`.yellow
          );
        }
      } else if (!commandDeleted) {
        await applicationCommands.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions,
        });
        console.log(
          `Application command ${commandName} has been registered.`.green
        );
      } else {
        console.log(
          `Application command ${commandName} has been skipped. Deletion was set.`
            .black
        );
      }
    }
  } catch (err) {
    console.error(`An error occurred! ${err.message}`.red);
  }
};
