
// var mongoose = require('mongoose')

// // create a Post model
// var Post = mongoose.model('Post', {
//     author: String,
//     text: String,
//     posts: String //[Post] // Posts in post
// })


// module.exports = Post



import mongoose from 'mongoose';

var Post = mongoose.model('Post', {
    title: String,
    content: String,
    userId: String
});

export default Post;




