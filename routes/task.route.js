const express = require("express");
const router = express.Router();
const { taskController } = require("../controllers");

router.post("/add",  taskController.createTask);
router.get("/get/:id",  taskController.getTask);
router.get("/list",   taskController.getList);
router.put("/update/:id",  taskController.updateTask);
router.delete("/delete/:id",  taskController.deleteTask);

module.exports = router;
