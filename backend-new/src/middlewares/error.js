const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: "Not found" });
};

const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server error"
  });
};

export { notFound, errorHandler };
