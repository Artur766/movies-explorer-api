const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

const { movieIdValidation, movieCreateValidation } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', movieCreateValidation, createMovie);
router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
