const { getById } = require("../users/users-model");

function logger(req, res, next) {
  console.log(`[${req.method}] ${req.url} ${Date.now()}`);
  next();
}

function validateUserId(req, res, next) {
  getById(req.params.id)
    .then(next)
    .catch((error) => {
      next({
        status: 404,
        message: `User with ID ${req.params.id} could not be found`,
        error: error.message,
      });
    });
}

function validateUser(req, res, next) {
  if (req.body.name) {
    next({ status: 400, message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (req.body.text) {
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
