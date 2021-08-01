const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  /*
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  */
  // const token = authorization.replace('Bearer ', '');
  const token = req.cookies.jwt;
  const secret = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
  try {
    if (!token) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
    return null;
  } catch (err) {
    next(err);
    return null;
  }
};
