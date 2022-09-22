const { StatusCodes } = require('http-status-codes');
const authService = require('../services/Auth.service');
const userService = require('../services/User.service');

const userController = {
  /** @type {import('express').RequestHandler} */
  async login(req, res) {
    const body = await userService.validateBodyLogin(req.body);
    const user = await userService.getByEmail(body.email);
    
    await userService.verifyPassword(body.password, user.password);

    const token = await authService.makeToken(user);

    res.status(StatusCodes.OK).json({ token });
  },
};

module.exports = userController;