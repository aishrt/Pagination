const express = require("express");
const landingRoute = require("./landing.route");
const taskRoute = require("./task.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "",
    route: landingRoute,
  },
  {
    path: "/task",
    route: taskRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
