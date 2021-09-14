const { Mongoose } = require('mongoose');
const movieModel = require('../Models/moviesModel');
const ratingModel = require('../Models/ratings');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * @path {http://localhost:3000/movie/post-movie}
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.post_movie = async (req, res) => {
    let movie_name = req.body.movie_name;
    let description = req.body.description;

    let create_movie = new movieModel({                                                                     // Posting Movie
        name: movie_name,
        description: description
    });

    let created_movie = await create_movie.save();                                                          // Saving In Db

    if (created_movie) {
        return res.status(200).json({
            'statusCode': 200,
            'message': 'created',
            'data': created_movie
        });
    }

    return res.status(200).json({
        'statusCode': 500,
        'message': 'Something Went Wrong'
    });
}

/**
 * @path {http://localhost:3000/movie/list-movies}
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.list_movies = async(req, res) =>{
    let limit = req.body.limit || 10;
    let skip = req.body.skip || 0;

    let get_movies = await movieModel.find().limit(limit).skip(skip);                                   // List Movies With Pagination

    if (get_movies && get_movies.length != 0) {
        return res.status(200).json({
            'statusCode': 200,
            'message': 'success',
            'data': get_movies
        })
    }

    return res.status(200).json({                                                   
        'statusCode': 404,
        'message': 'No Data Found'
    });

}

/**
 * @path {http://localhost:3000/movie/rate-movie}
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.rate_movie = async (req, res) => {
    let movie_id = req.body.movie_id;
    let user_email = req.body.email;
    let rating_obtained = req.body.rating;
    let comment = req.body.comment;

    if (!ObjectId.isValid(movie_id)) {
        return res.status(200).json({
            'statusCode': 400,
            'message': 'invalid movie id',
        });
    }

    let validate_user = await ratingModel.find({
        movie_id: movie_id,
        user_email: user_email
    });

    if (validate_user && validate_user.length != 0) {
        return res.status(200).json({
            'statusCode': 400,
            'message': 'Rating Already Given'
        })
    }

    let rate_movie = new ratingModel({
        movie_id: movie_id,
        user_email: user_email,
        rating_obtained: rating_obtained,
        comment: comment
    });

    let save_rating = await rate_movie.save();
    if (save_rating) {
        return res.status(200).json({
            'statusCode': 200,
            'message': 'Rated'
        });
    }

    return res.status(200).json({
        'statusCode': 500,
        'message': 'Something Went Wrong'
    });
}

/**
 * @path {http://localhost:3000/movie/total-and-average-ratings}
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.total_and_average_ratings = async (req, res) => {

    let get_average_and_sum = await ratingModel.aggregate([                                             // get average ratings and sum of rating for every distinct movies
        {
            $group: {
                _id: "$movie_id", average_rating: { $avg: "$rating_obtained" },
                rating: { $sum: "$rating_obtained" }
            }
        }]);

    if (get_average_and_sum && get_average_and_sum.length != 0) {
        return res.status(200).json({
            'statusCode': 200,
            'message': 'success',
            'data': get_average_and_sum
        })
    }

    return res.status(200).json({
        'statusCode': 404,
        'message': 'No Data Found'
    })
}

/**
 * @path {http://localhost:3000/movie/list-comments-ratings}
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.list_comments_ratings = async (req, res) => {
    let movie_id = req.body.movie_id;
    let limit = req.body.limit || 10;
    let skip = req.body.skip || 0;

    if (!ObjectId.isValid(movie_id)) {
        return res.status(200).json({
            'statusCode': 400,
            'message': 'invalid movie id',
        });
    }

    let get_rating_comments = await ratingModel.find({                                                          // Listing Comments And Ratings Of Selected Movie
        movie_id: movie_id
    }, {
        _id: 0,
        movie_id: 1,
        rating_obtained: 1,
        comment: 1
    }).sort({ rating_obtained: 1 })
        .limit(limit)
        .skip(skip);

    if (get_rating_comments && get_rating_comments.length != 0) {
        return res.status(200).json({
            'statusCode': 200,
            'message': 'success',
            'data': get_rating_comments
        })
    }

    return res.status(200).json({
        'statusCode': 404,
        'message': 'No Data Found'
    });
}