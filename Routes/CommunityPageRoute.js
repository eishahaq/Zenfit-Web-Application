const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyAccessToken } = require('../Helpers/JwtHelper');
const User = require('../Models/User');
const CommunityPage = require('../Models/CommunityPage');

// Add a post
router.post('/posts', verifyAccessToken, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user._id;
    const post = new CommunityPage({
      _id: mongoose.Types.ObjectId,
      userId,
      status,
      likes: [],
      comments: []
    });
    const result = await post.save();
    res.status(201).json({ post: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Like a post
router.post('/:id/like', verifyAccessToken, (req, res, next) => {
    try {
      const post = CommunityPage.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.likes.includes(req.user._id)) {
        return res.status(400).json({ message: 'Post already liked' });
      }
      post.likes.push(req.user._id);
      post.save();
      res.status(200).json({ message: 'Post liked' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  });

// Comment on a post
router.post('/:id/comment', verifyAccessToken, (req, res, next) => {
    try {
      const post = CommunityPage.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const comment = { user: req.user._id, text: req.body.text };
      post.comments.push(comment);
      post.save();
      res.status(200).json({ message: 'Comment added', comment });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  });



// Get all posts
router.get('/posts', verifyAccessToken, (req, res) => {
  try {
    const user = User.findById(req.payload.aud);
    const posts = CommunityPage.find().populate('userId', 'username').populate('likes', 'username').populate('comments.user', 'username');
    res.status(200).json({ posts });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a post by id
router.get('/posts/:id', verifyAccessToken, (req, res) => {
  try {
    const user = User.findById(req.payload.aud);
    const posts = CommunityPage.find().populate('userId', 'username').populate('likes', 'username').populate('comments.user', 'username');
    res.status(200).json({ posts });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update a post by id
router.put('/posts/:id', verifyAccessToken, async (req, res) => {
  try {
    const { status } = req.body;
    const post = CommunityPage.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    post.status = status;
    const result = await post.save();
    res.status(200).json({ post: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete a post by id
router.delete('/posts/:id', verifyAccessToken, (req, res) => {
  try {
    const post = CommunityPage.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    post.remove();
    res.status(200).json({ message: 'Post has been deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;




