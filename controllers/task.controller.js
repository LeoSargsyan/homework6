import fs from 'fs';
import path from 'path';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

const TASKS_FILE = path.resolve('tasks.json');

const readTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
    console.log('Tasks successfully saved to file.');
  } catch (error) {
    console.error('Error writing to tasks file:', error);
  }
};

let tasks = readTasks();

export default {
  getTasks: (req, res) => {
    const {userId} = req.params;
    const userTasks = tasks.filter(task => task.userId === userId)

    if (userTasks.length === 0) {
      return res.status(404).json({message: 'No tasks found for this user'});
    }

    res.status(200).json({tasks: userTasks});
  },

  createTask: (req, res) => {
    console.log("Received request to create task:", req.body);
    const {title, description, taskDate, userId} = req.body;

    if (!title || !description || !taskDate || !userId) {
      return res.status(422).json({message: 'Missing required fields'});
    }

    const newTask = {
      id: uuidv4(),
      title,
      description,
      taskDate: moment(taskDate).toISOString(),
      userId,
    };

    tasks.push(newTask);
    console.log("Updated tasks list:", tasks);

    try {
      writeTasks(tasks);
    } catch (error) {
      console.error('Error saving task:', error);
      return res.status(500).json({message: 'Error saving task'});
    }

    res.status(201).json({task: newTask, message: 'Task successfully created'});
  },

  updateTask: (req, res) => {
    const {taskId} = req.params;
    const {title, description, taskDate} = req.body;

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
      return res.status(404).json({message: 'Task not found'});
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.taskDate = taskDate ? moment(taskDate).toISOString() : task.taskDate;


    console.log(tasks)
    try {
      writeTasks(tasks);
    } catch (error) {
      return res.status(500).json({message: 'Error updating task'});
    }

    res.status(200).json({task, message: 'Task successfully updated'});
  },

};


console.log('Tasks are being written to file', tasks);

























