const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
     name: {
        type: String,
        required: true
    },

});
const User = mongoose.model("User", userSchema);

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = { User, BlogPost };