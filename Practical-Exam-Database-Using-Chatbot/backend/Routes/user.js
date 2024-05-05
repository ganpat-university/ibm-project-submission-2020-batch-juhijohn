const express = require('express');
const { getUsers, registerUsers, loginUser, checkRole, checkUser, updateUser, deleteUser, countUsers } = require('../Controllers/user');
const router = express.Router();
const { authUser } = require('../Middlewares/authUser');
const { authRole } = require('../Middlewares/authRole');

router.get('/all', authUser, authRole('admin') ,getUsers);
router.post('/register',registerUsers);
router.post('/login', loginUser);
router.post('/check/:token', checkRole);
router.post('/validate', checkUser);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);
router.get('/count', countUsers);
module.exports = router;