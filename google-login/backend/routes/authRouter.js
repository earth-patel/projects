const { googleLogin } = require('../controllers/authController');
const router = require('express').Router();

router.get('/google', googleLogin);

module.exports = router;
