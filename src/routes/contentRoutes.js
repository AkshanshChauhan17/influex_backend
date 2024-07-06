const express = require('express');
const contentController = require('../controllers/contentController');
const { videoUpload } = require('../config/multerConfig');
const router = express.Router();

router.get('/content', contentController.getAllContent);
router.get('/content/:id', contentController.getContentById);
router.get('/content/count/:id', contentController.countContentByUpload);
router.post('/content', contentController.createContent);
router.put('/content/:id', contentController.updateContent);
router.delete('/content/:id', contentController.deleteContent);
router.post('/content/video', videoUpload.single('video'), contentController.uploadVideo);
router.delete('/content/:id/video', contentController.deleteVideo);

module.exports = router;