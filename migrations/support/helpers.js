const fs = require("fs");
const path = require("path");

module.exports = {
  updateState: (newState) => {
    let stateFile = path.join(__dirname, "../.state.json");
    let state = JSON.parse(
      (() => {
        try {
          fs.readFileSync(stateFile, "utf8");
        } catch(e) {
          return "{}";
        }
      })()
    );
    state = Object.assign({}, state, newState);
    fs.writeFileSync(stateFile, JSON.stringify(state), "utf8");
    return state;
  },

  abort: (message) => {
    return (error) => {
      console.error(message);
      console.error(error);
      process.exit(1);
    };
  },
};
