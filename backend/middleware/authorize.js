export function authorizeMiddleware(req, res, next) {
  // Let the user through if they are in session
  if (req.session.userId && req.session.userName) {
    return next();
  }
  // Return an error for unathorized access
  else {
    return res.status(401).json({ message: "Unauthorized access." });
  }
}
