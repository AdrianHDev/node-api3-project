const express = require("express");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", (req, res) => {
  Users.get().then((users) => {
    res.json(users);
  });
});

router.get("/:id", validateUserId, (req, res, next) => {
  Users.getById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      next({ status: 500, message: "Internal server error", ...error });
    });
  // this needs a middleware to verify user id
});

router.post("/", validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      next({ status: 500, message: "internal server error" });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  Users.update(req.params.id, req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      next({ status: 500, message: "internal server error." });
    });
  // res.json({message: "Received"})
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  const oldUser = await Users.getById(req.params.id)
  Users.remove(req.params.id).then(removed => {
    res.json(oldUser);
  }).catch(err => {
    next({ status: 500, message: "internal server error." });
  })
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  Users.getUserPosts(req.params.id).then(posts => {
    res.json(posts)
  }).catch(() => {
    next({ status: 500, message: "internal server error"})
  })
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  Posts.insert({...req.body, user_id: req.params.id }).then(nPost => {
    res.json(nPost)
  }).catch(() => {
    next({status: 500, message: "internal server error"})
  })
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500 ).json({
    custom: "error occured.",
    message: err.message,
    err: err.err
  })
})

// do not forget to export the router
module.exports = router;
