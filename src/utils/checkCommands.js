module.exports = (existingCommand, localCommand) => {
  const hasChanged = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

  if (
    hasChanged(existingCommand.name, localCommand.data.name) ||
    hasChanged(
      existingCommand.description || undefined,
      localCommand.data.description || undefined
    )
  ) {
    return true;
  }

  const optionsChanged = hasChanged(
    normalizeOptions(existingCommand),
    normalizeOptions(localCommand.data)
  );

  return optionsChanged;

  function normalizeOptions(command) {
    const clean = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          clean(obj[key]);
          if (!obj[key] || (Array.isArray(obj[key]) && !obj[key].length)) {
            delete obj[key];
          }
        } else if (obj[key] === undefined) {
          delete obj[key];
        }
      }
    };

    const standardize = (input) => {
      if (Array.isArray(input)) {
        return input.map((item) => standardize(item));
      }

      return {
        type: input.type,
        name: input.name,
        description: input.description,
        options: input.options ? standardize(input.options) : undefined,
        required: input.required,
      };
    };

    return (command.options || []).map((option) => {
      let cleanedOption = JSON.parse(JSON.stringify(option));
      cleanedOption.options
        ? (cleanedOption.options = standardize(cleanedOption.options))
        : (cleanedOption = standardize(cleanedOption));
      clean(cleanedOption);
      return {
        ...cleanedOption,
        choices: cleanedOption.choices
          ? stringifyChoices(cleanedOption.choices)
          : null,
      };
    });
  }

  function stringifyChoices(choices) {
    return JSON.stringify(choices.map((choice) => choice.value));
  }
};
