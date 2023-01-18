const express = require('express');
const router = express.Router();

//logout
router.get('/', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ "message": "Logout Successfully" });
    // res.redirect('/api/login');
});
module.exports = router;