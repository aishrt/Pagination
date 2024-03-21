const catchAsync = require("../utils/catchAsync");
const { Task } = require("../models");

// --------------- Create Task Detail ------------------
const createTask = catchAsync(async (req, res) => {
  try {
    const existing = await Task.findOne({ title: req.body.title });
    if (existing) {
      return res.status(400).json({
        status: "400",
        message: "Task title already submited!",
      });
    }
    const task = await Task.create({ ...req.body });
    return res.status(200).json({
      status: "200",
      message: "Task created successfully!",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetcihng task data !",
      error: error.message,
    });
  }
});

// --------------- Get One Task Data ------------------
const getTask = catchAsync(async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskDetail = await Task.findById(taskId);
    return res.status(200).json({
      status: "200",
      message: "Task data fetched successfully!",
      data: taskDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetcihng task data !",
      error: error.message,
    });
  }
});

// -------------------- Update Task  ------------------
const updateTask = catchAsync(async (req, res) => {
  try {
    const taskId = req.params.id;
    const existing = await Task.findOne({
      title: req.body.title,
      _id: { $ne: taskId },
    });
    if (existing) {
      return res.status(400).json({
        status: "400",
        message: "Task title exists!",
      });
    }

    const taskDetail = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: "200",
      message: "Task data updated successfully!",
      data: taskDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while updating task data !",
      error: error.message,
    });
  }
});

// ------------------------ Delete selected Task ------------------
const deleteTask = catchAsync(async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findOneAndDelete({ _id: taskId });
    return res.status(200).json({
      status: "200",
      message: "Task deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while deleting task data !",
      error: error.message,
    });
  }
});

// --------------------- Get List of all tasks's ------------------
const getList = catchAsync(async (req, res) => {
  const searchName = req.query.name;
  const itemPerPage = req.query.itemPerPage;
  const perPage = itemPerPage ? parseInt(itemPerPage, 10) : 6; //  Number of documents to display on each page
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // It specify the selected page number
  let query = {};

  if (searchName) {
    const searchValue = new RegExp(searchName, "i");
    query.$or = [{ title: searchValue }, { author: searchValue }];
  } // You can search task through title or author

  try {
    const totalCount = await Task.countDocuments(query);

    const taskList = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.status(200).json({
      status: "200",
      message: "Task list fetched successfully!",
      data: taskList,
      page,
      totalPages: Math.ceil(totalCount / perPage),
      count: taskList.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching task list!",
      error: error.message,
    });
  }
});

module.exports = {
  createTask,
  getTask,
  updateTask,
  getList,
  deleteTask,
};
