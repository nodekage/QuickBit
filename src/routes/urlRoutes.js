// urlRoutes.js
const express = require('express');
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/shorten', authMiddleware, urlController.shortenUrl);
router.get('/history', authMiddleware, urlController.getUserHistory);
router.get('/redirect/:shortUrl', urlController.redirectUrl);

module.exports = router;
