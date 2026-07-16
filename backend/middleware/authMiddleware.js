// This is "middleware" - a function that runs BEFORE a route's real logic,
// and can either let the request continue (by calling next()) or stop it
// there and send an error response.
//
// We'll attach this to any route that should ONLY work for logged-in users
// (like getting/creating/deleting expenses - nobody should see or touch
// expenses that aren't theirs).

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // The frontend will send the token in a request header like this:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - no token provided",
      });
    }

    // "Bearer eyJhbGc..." -> split by space -> take the second part, the actual token
    const token = authHeader.split(" ")[1];

    // jwt.verify checks TWO things at once:
    // 1. Was this token signed with OUR secret key (not forged)?
    // 2. Has it expired yet?
    // If either check fails, this throws an error, caught below.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We attach the logged-in user's id onto the request object itself.
    // Every route handler AFTER this middleware can now read req.userId
    // to know exactly who is making this request.
    req.userId = decoded.userId;

    next(); // everything checked out - let the request continue to the actual route
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized - invalid or expired token",
    });
  }
};

module.exports = protect;