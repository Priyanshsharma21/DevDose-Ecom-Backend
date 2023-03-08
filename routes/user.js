import express from 'express'
import { isLoggedIn,customRole }  from '../middlewares/user.js'
import { signUp, signUpGreet,login,logout,forgotPassword, resetPassword,getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUsers, managerAllUsers,adminGetOneUser, adminUpdateAnyUser,adminDeletingOneUser } from '../controllers/user.js'



const router = express.Router()

router.get('/signup',signUpGreet)
router.post('/signup', signUp)
router.post('/login', login)
router.get('/logout',logout)
router.post('/forgotpassword', forgotPassword)
router.post('/password/reset/:token', resetPassword)
router.get('/userdashboard',isLoggedIn, getLoggedInUserDetails)
router.post('/password/update',isLoggedIn, changePassword)
router.put('/userdashboard/update',isLoggedIn, updateUserDetails)

router.get('/admin/users',isLoggedIn,customRole("admin"), adminAllUsers)
router.get('/manager/users',isLoggedIn,customRole("manager"), managerAllUsers)

router.get('/admin/user/:id',isLoggedIn,customRole("admin"), adminGetOneUser)

router.put('/admin/user/:id',isLoggedIn,customRole("admin"), adminUpdateAnyUser)
router.delete('/admin/user/:id',isLoggedIn,customRole("admin"), adminDeletingOneUser)





export default router