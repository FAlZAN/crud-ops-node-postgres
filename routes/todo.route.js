const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} = require("../controller/todo.controller");

router.post("/", createTask);

router.get("/", getAllTask);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;
