const catchAsync = require("../utils/catchAsync");
const { Task } = require("../models");

// --------------- Create Task Detail ------------------
const createTask = catchAsync(async (req, res) => {
  try {
    const identity = req.user;
    const task = await Task.create({ ...req.body, userId: identity });
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
  const currentUser = req.user;
  const perPage = 9; //  Number of documents to display on each page
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // It specify the selected page number

  let query = { userId: currentUser };

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
