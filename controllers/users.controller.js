import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

import helpers from "../utils/helpers.js";

const usersFilePath = path.resolve('users.json');

let users = [];
try {
  const usersData = fs.readFileSync(usersFilePath, 'utf-8');
  users = JSON.parse(usersData);
} catch (err) {
  console.log('No users file found, starting fresh.');
}

let registeredUsers = [];

export default {
  login: async (req, res) => {
    const { login, password } = req.body;

    const ifExist = users.find(user => user.login === login);

    if (!ifExist) {
      res.status(422).json({
        message: 'user not found',
      });
      return;
    }

    if (ifExist.password === helpers.passwordHash(password)) {
      const expiresIn = moment().add(10, 'minutes').toISOString();

      const token = helpers.encrypt({
        userId: ifExist.id,
        expiresIn,
      });

      res.status(200).json({
        token: token,
        expiresIn,
      });
      return;
    }

    res.status(401).json({
      message: 'invalid password',
    });
  },

  register: async (req, res) => {
    const { login, password } = req.body;

    const ifExist = users.find(user => user.login === login);

    if (ifExist) {
      res.status(422).json({
        message: 'user already exist',
      });
      return;
    }

    const newUser = {
      id: uuidv4(),
      login,
      password: helpers.passwordHash(password),
    };

    users.push(newUser);

    registeredUsers.push({
      userId: newUser.id,
      login: newUser.login,
    });

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({
      users,
      message: 'successfully registered',
    });
  },

  profile: async (req, res) => {
    const user = users.find(user => user.id === req.userId);

    res.json({
      user,
      message: 'user profile',
    });
  },

  getRegisteredUsers: async (req, res) => {
    res.json({
      registeredUsers,
      message: 'registered users list',
    });
  },
};
