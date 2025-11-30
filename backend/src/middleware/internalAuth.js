const { N8N_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const secret = req.header('X-N8N-Secret');
  if (!secret || secret !== N8N_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};