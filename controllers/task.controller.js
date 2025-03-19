import db from '../clients/db.mysql.js';
import moment from 'moment';

export default {

  getTasks: async (req, res) => {
    const { userId } = req.params;

    try {
      const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);

      if (tasks.length === 0) {
        return res.status(404).json({ message: 'No tasks found for this user' });
      }

      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  },

  createTask: async (req, res) => {
    const { title, description, taskDate } = req.body;

    if (!title || !description || !taskDate) {
      return res.status(422).json({ message: 'Missing required fields' });
    }

    try {
      console.log('Creating task with the following data:', { title, description, taskDate });

      const [result] = await db.query(`
        INSERT INTO tasks (title, description, taskDate)
        VALUES (?, ?, ?)
      `, [title, description, taskDate]);

      console.log('Task created successfully, ID:', result.insertId);

      res.status(201).json({
        message: 'Task successfully created',
        task: { id: result.insertId, title, description, taskDate },
      });
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ message: 'Error creating task', error: err.message });
    }
  },



  updateTask: async (req, res) => {
    const { taskId } = req.params;
    const { title, description, taskDate } = req.body;

    try {
      const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      const task = tasks[0];

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updatedTask = {
        title: title || task.title,
        description: description || task.description,
        taskDate: taskDate ? moment(taskDate).toISOString() : task.taskDate,
      };

      await db.query(`
        UPDATE tasks
        SET title = ?, description = ?, taskDate = ?
        WHERE id = ?
      `, [updatedTask.title, updatedTask.description, updatedTask.taskDate, taskId]);

      res.status(200).json({ task: updatedTask, message: 'Task successfully updated' });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ message: 'Error updating task' });
    }
  },
};


























