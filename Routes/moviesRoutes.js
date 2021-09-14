const router = require('express').Router();
const moviesControllers = require('../Controllers/moviesControllers');

// routes
router.post('/post-movie', moviesControllers.post_movie);
router.post('/list-movies', moviesControllers.list_movies);
router.post('/rate-movie', moviesControllers.rate_movie);
router.post('/total-and-average-ratings', moviesControllers.total_and_average_ratings);
router.post('/list-comments-ratings', moviesControllers.list_comments_ratings);

module.exports = router;