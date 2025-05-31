const express = require('express')
const router = express.Router();
const user = require("../controllers/logic");
const jwtMiddleware = require("../middleware/jwtMiddleware");

router.post("/api/register", user.register);
router.post("/api/login", user.login);
router.post('/api/posts', jwtMiddleware, user.addPost);
router.get('/api/posts', jwtMiddleware, user.getMyPosts);
router.delete('/api/posts/:id', jwtMiddleware, user.deletePost);
router.put('/api/posts/:id',jwtMiddleware, user.editPost)

module.exports = router;
