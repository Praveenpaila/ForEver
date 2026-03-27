const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

export default adminOnly;
