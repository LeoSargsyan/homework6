// import moment from 'moment';
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import path from 'path';
//
// import helpers from "../utils/helpers.js";
// import Users from "../models/users.table.js";
//
// const usersFilePath = path.resolve('users.json');
//
// let users = [];
// try {
//   const usersData = fs.readFileSync(usersFilePath, 'utf-8');
//   users = JSON.parse(usersData);
// } catch (err) {
//   console.log('No users file found, starting fresh.');
// }
//
// let registeredUsers = [];
//
// export default {
//   login: async (req, res) => {
//     const { login, password } = req.body;
//
//     const ifExist = users.find(user => user.login === login);
//
//     if (!ifExist) {
//       res.status(422).json({
//         message: 'user not found',
//       });
//       return;
//     }
//
//     if (ifExist.password === helpers.passwordHash(password)) {
//       const expiresIn = moment().add(10, 'minutes').toISOString();
//
//       const token = helpers.encrypt({
//         userId: ifExist.id,
//         expiresIn,
//       });
//
//       res.status(200).json({
//         token: token,
//         expiresIn,
//       });
//       return;
//     }
//
//     res.status(401).json({
//       message: 'invalid password',
//     });
//   },
//
//   register: async (req, res) => {
//     const { login, password } = req.body;
//
//     const ifExist = users.find(user => user.login === login);
//
//     if (ifExist) {
//       res.status(422).json({
//         message: 'user already exist',
//       });
//       return;
//     }
//
//     const newUser = {
//       id: uuidv4(),
//       login,
//       password: helpers.passwordHash(password),
//     };
//
//     users.push(newUser);
//
//     registeredUsers.push({
//       userId: newUser.id,
//       login: newUser.login,
//     });
//
//
//
//     fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
//
//     res.json({
//       users,
//       message: 'successfully registered',
//     });
//   },
//
//   profile: async (req, res) => {
//     const user = users.find(user => user.id === req.userId);
//
//     res.json({
//       user,
//       message: 'user profile',
//     });
//   },
//
//   getRegisteredUsers: async (req, res) => {
//     res.json({
//       registeredUsers,
//       message: 'registered users list',
//     });
//   },
// };

import moment from 'moment';
import db from '../clients/db.mysql.js';
import helpers from "../utils/helpers.js";

export default {
  login: async (req, res) => {
    const { login, password } = req.body;

    try {
      const [users] = await db.query('SELECT * FROM users WHERE login = ?', [login]);

      if (users.length === 0) {
        return res.status(422).json({ message: 'user not found.' });
      }

      const user = users[0];

      // Сравнение хэшированного пароля
      if (user.password === helpers.passwordHash(password)) {
        const expiresIn = moment().add(10, 'minutes').toISOString();
        const token = helpers.encrypt({ userId: user.id, expiresIn });

        return res.status(200).json({ token, expiresIn });
      }

      return res.status(401).json({ message: 'invalid password' });

    } catch (err) {
      console.error('error in login:', err);
      return res.status(500).json({ message: 'error in server' });
    }
  },

  register: async (req, res) => {
    const { login, password, dob } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "login and password is required" });
    }

    try {
      const [existingUsers] = await db.query('SELECT * FROM users WHERE login = ?', [login]);

      if (existingUsers.length > 0) {
        return res.status(422).json({ message: 'user already exists with this login' });
      }

      const hashedPassword = helpers.passwordHash(password);

      await db.query(`
        INSERT INTO users (login, password, dob)
        VALUES (?, ?, ?)
      `, [login, hashedPassword, dob]);

      res.json({ message: 'registration successful' });

    } catch (err) {
      console.error('error with password:', err);
      res.status(500).json({ message: 'error in server' });
    }
  },

  profile: async (req, res) => {
    try {
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);

      if (users.length === 0) {
        return res.status(404).json({ message: 'user not found.' });
      }

      res.json({ user: users[0], message: 'profile user' });

    } catch (err) {
      console.error('error with get profile:', err);
      res.status(500).json({ message: 'error in server' });
    }
  },
};

