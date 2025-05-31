const { User, BlogPost } = require("../models/collection");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Register 
// exports.register = async (req, res) => {
//     const { email, password,name } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({ error: "User already exists." });
//         } else {
//             const newUser = await User.create({
//                 email: email,
//                 password: password,
//                 name:name
//             });

//             return res.status(200).json({ message: `${name} registered successfully` });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            name: name
        });

        return res.status(200).json({ message: `${name} registered successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// Login 
// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const currentUser = await User.findOne({ email });

//         if (currentUser) {
//             if (password === currentUser.password) {
//                 const token = jwt.sign({ _id: currentUser._id }, "superkey123");
//                 res.status(200).json({ user: currentUser, token });
//             } else {
//                 res.status(401).json({ message: "Incorrect password" });
//             }
//         } else {
//             res.status(404).json({ message: "User not found" });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
// Login 
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const currentUser = await User.findOne({ email });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, currentUser.password);

        if (isMatch) {
            const token = jwt.sign({ _id: currentUser._id }, "superkey123");
            res.status(200).json({ user: currentUser, token });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};



// create post 
exports.addPost = async (req, res, next) => {
    const uid = req.payload;
    const { title, content } = req.body;
    if (!uid) {
        return res.status(400).json({ message: "User ID required" });
    }
    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!title || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const post = await BlogPost.create({
            author: user.name,
            title,
            content,
        });
        await post.save();
        return res.status(200).json({
            message: "Post Created successfully",
            status: true,
            statusCode: 200,
            post
        });
    } catch (error) {
        return next(error);
    }
};

// get loggined user post 
exports.getMyPosts = async (req, res) => {
    const uid = req.payload;

    try {
        const currentUser = await User.findById(uid);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await BlogPost.find({ author: currentUser.name }).sort({ createdAt: -1 });

        const formattedPosts = posts.map(post => ({
            title: post.title,
            content: post.content,
            createdAt: post.createdAt
        }));

        return res.status(200).json({ posts: formattedPosts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// delete post 
exports.deletePost = async (req, res) => {
    const { id } = req.params;
console.log(req.params);

    try {
        const deletedPost = await BlogPost.findByIdAndDelete(id);

        if (deletedPost) {
            return res.status(200).json({ message: 'Post Deleted Successfully' });
        } else {
            return res.status(404).json({ message: 'Post Not Found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// edit post 
exports.editPost = async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;

    try {
        const existingPost = await BlogPost.findById(id);

        if (existingPost) {
            existingPost.title = title;
            existingPost.content = content;

            await existingPost.save();

            return res.status(200).json({ message: 'Post details updated', post: existingPost });
        } else {
            return res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};