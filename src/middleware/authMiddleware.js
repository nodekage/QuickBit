// authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  //console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    //console.log('Decoded User ID:', req.userId);
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

