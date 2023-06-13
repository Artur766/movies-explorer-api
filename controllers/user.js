const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден.'));
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным id не найден.');
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) return next(new ConflictError('Пользователь с данным email уже существует'));
      if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  // ищет запись по идентификатору
  const {
    name,
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => res.status(201).send({
        email: user.email,
        name: user.name,
        _id: user._id,
      }))
      .catch((err) => {
        if (err.code === 11000) return next(new ConflictError('Пользователь с данным email уже существует'));
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        return next(err);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};
