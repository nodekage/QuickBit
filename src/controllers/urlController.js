// urlController.js
const shortid = require('shortid');
const Url = require('../models/urlModel');

exports.shortenUrl = async (req, res) => {
    try {
      const { originalUrl, customUrl } = req.body;
  
      let shortUrl;
  
      if (!customUrl) {
        // If customUrl is empty, generate shortUrl using shortid
        shortUrl = shortid.generate();
      } else {
        // If customUrl is provided, check if it's already used
        const existingUrl = await Url.findOne({ shortUrl: customUrl });
  
        if (existingUrl) {
          return res.status(400).json({ error: 'Custom URL is already in use' });
        }
  
        shortUrl = customUrl;
      }
  
      const newUrl = new Url({
        originalUrl,
        shortUrl,
        user: req.userId, // Assuming you have middleware setting userId in req
      });
  
      await newUrl.save();
  
      res.json({ shortUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.getUserHistory = async (req, res) => {
    try {
      console.log('User ID:', req.userId);
  
      const history = await Url.find({ user: req.userId });
  
      console.log('URL History:', history);
  
      res.json({ history });
    } catch (error) {
      console.error('Error fetching URL history:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  exports.redirectUrl = async (req, res) => {
    try {
      const { shortUrl } = req.params;
      console.log(shortUrl)
      const url = await Url.findOne({ shortUrl });
  
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
  
      url.clicks += 1;
      await url.save();

      console.log(`Redirecting to: ${url.originalUrl}`);
      res.json({ originalUrl: url.originalUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
