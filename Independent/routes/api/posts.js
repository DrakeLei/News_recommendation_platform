const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
//model
const Post = require("../../models/Post");
//validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

// @route   POST api/posts
// @desc    Create post
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //If any errors, return 400 and errors
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      type: req.body.type,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   Get api/posts/
// @desc    Fetch posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .limit(20)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No posts found"
      })
    );
});

// @route   Get api/posts/i/:id
// @desc    Fetch single post by id
// @access  Public
router.get("/i/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post found with that id"
      })
    );
});

// @route   Get api/posts/t/:type
// @desc    Fetch posts by their type
// @access  Public
router.get("/t/:type", (req, res) => {
  Post.find({ type: req.params.type })
    .limit(10)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post is with that type"
      })
    );
});

// @route   DELETE api/posts/:id
// @desc    Delete single post by id
// @access  Public
/*
router.delete("/:id", (req, res) => {
    Post.findById(req.params.id)
      .then(post => res.json(post))
      .catch(err =>
        res.status(404).json({
          nopostfound: "No post found with that id"
        })
      );
  });
*/

// @route   Post api/posts/like/:id
// @desc    Like single post by id
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //has already liked it
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "the news is already liked" });
        }
        //add user id to like
        post.likes.unshift({ user: req.user.id });
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          nopostfound: "No post found with that id"
        })
      );
  }
);

// @route   Post api/posts/unlike/:id
// @desc    unLike single post by id
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //has already liked it
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res.status(400).json({
            notliked: "not liked before"
          });
        }
        //remove user id from like
        const removeindex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);
        post.likes.splice(removeindex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          nopostfound: "No post found with that id"
        })
      );
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to news
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //If any errors, return 400 and errors
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //Add to comments array
        post.comments.unshift(newComment);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          nopostfound: "No post found with that id"
        })
      );
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from news
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if the
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexist: "Comment does not exist" });
        }

        //
        const removeindex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeindex, 1);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          nopostfound: "No post found with that id"
        })
      );
  }
);

module.exports = router;
