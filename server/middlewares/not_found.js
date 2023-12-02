const notFoundMiddleware = (req, res) =>
  res.status(404).json({ error: "Route does not exist" });

export default notFoundMiddleware;
