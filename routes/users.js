const routerUser = require('express').Router(); // создали роутер
const validator = require('validator');

const { celebrate, Joi } = require('celebrate');

const {
  getCurUser, updateUserInfo,
} = require('../controllers/users');

// routerUser.get('/', getUsers);
routerUser.get('/me', getCurUser);
/*
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUser);
*/

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (!validator.isEmail(value)) {
        return helpers.message('Введены невалидные данные');
      }
      return value;
    }, 'custom validation'),
  }),
}), updateUserInfo);

/*
routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        return helpers.message('Введены невалидные данные');
      }
      return value;
    }, 'custom validation'),
  }),
}), updateUserAvatar);
*/

module.exports = routerUser; // экспортировали роутер
