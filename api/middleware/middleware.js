const { getById } = require("../users/users-model");

function logger(req, res, next) {
  console.log("In logger!")
  console.log(`[${req.method}] ${req.url} \x1b[35m${Date().toLocaleString()}\x1b[0m `);
  next();
}

function validateUserId(req, res, next) {
  getById(req.params.id)
    .then((user) => {
      if (user) {
        next();
      } else {
        next({ status: 404, message: "user not found" });
      }
    })
    .catch(() => {
      next({
        status: 500,
        message: `server error`,
      });
    });
}

function validateUser(req, res, next) {
  console.log(req.body)
  if (!req.body.name) {
    next({ status: 400, message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  console.log('validating post.')
  if (!req.body.text) {
    next({ status: 400, message: "missing required text field" });
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
