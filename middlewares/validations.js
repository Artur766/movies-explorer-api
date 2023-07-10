const { celebrate, Joi } = require('celebrate');

const urlValidator = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

const userUpdateInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(24).required(),
  }),
});

const signUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(24).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const movieCreateValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri({
      scheme: ['http', 'https'],
    }).pattern(urlValidator),
    trailerLink: Joi.string().required().uri({
      scheme: ['http', 'https'],
    }).pattern(urlValidator),
    thumbnail: Joi.string().required().uri({
      scheme: ['http', 'https'],
    }).pattern(urlValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  signIn,
  signUp,
  userUpdateInfoValidation,
  movieCreateValidation,
  movieIdValidation,
};
