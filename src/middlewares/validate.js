const { ValidationError } = require("yup");

exports.validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }
    return res.status(500).json({ success: false });
  }
};
