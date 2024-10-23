const express = require("express");
const routes = require("./routes");
const path = require('path');


let cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());

// image upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "assets")));

const port = process.env.REACT_APP_PORT;
app.listen(port, (req, res) => {
  console.log(`Server is listening at http://localhost:${port}`);
});

require("./config/config");
require("./routes/router")(app);

app.use("/", routes);
