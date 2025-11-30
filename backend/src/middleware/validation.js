const Joi = require('joi');

const videoUploadSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(5000)
});

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports.videoUpload = (req, res, next) => {
  const { error } = videoUploadSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};