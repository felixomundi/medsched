const express = require('express');
const {
registerUser,
loginUser,   
updateUser,
changePassword, 
resetPassword, 
getUsers,
addUser, 
forgotPassword,
deleteUser,
getUser,
updateUserByAdmin} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware')
const isAdmin = require("../middleware/adminMiddleware")
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put("/profile", protect, updateUser);
router.patch('/change-password', protect, changePassword);
router.post('/forgot-password',forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/create", isAdmin, addUser);
router.patch('/edit/:id', isAdmin, updateUserByAdmin);
router.get("/:id",  getUser);
router.get("/",  getUsers);
router.delete("/:id", isAdmin, deleteUser);
module.exports = router;
