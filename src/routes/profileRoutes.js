const express = require('express');
const profileController = require('../controllers/profileController');
const { profileUpload } = require('../config/multerConfig');
const router = express.Router();

router.get('/profile', profileController.getAllProfile);
router.get('/profile/:id', profileController.getProfileById);
router.get('/profile/verify/:login_token', profileController.verifyByLoginToken)
router.post('/profile', profileController.createProfile);
router.put('/profile/:id', profileController.updateProfile);
router.delete('/profile/:id', profileController.deleteProfile);
router.post('/profile/token/:email', profileController.getLoginToken);
router.put('/profile/image/:id', profileUpload.single("image"), profileController.updateProfilePhoto);

module.exports = router;