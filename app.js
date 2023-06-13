require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimiter = require('./rateLimiter');
const { signIn, signUp } = require('./middlewares/validations');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { handleError } = require('./middlewares/handleError');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());

// применяем лимитер ко всем маршрутам, начинающимся с /api/
app.use('/api/', rateLimiter);

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => {
    console.log('Подключение к базе данных прошло успешно');
  })
  .catch((err) => {
    console.error(`Ошибка подключения к базе данных: ${err.message}`);
    process.exit(1);
  });

app.use(helmet());

app.use(requestLogger);

// роуты, не требующие авторизации,
app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

app.use('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
