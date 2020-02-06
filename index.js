const app = require("./app");
const database = require("./database");
const config = require("./config");

database()
  .then(info => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    app.listen(config.PORT, () =>
      console.log("server start port " + config.PORT)
    );
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
