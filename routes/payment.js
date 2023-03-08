import express from 'express'
import {captureRazorPayment, captureStripePayment} from '../controllers/payment.js'
import { isLoggedIn }  from '../middlewares/user.js'

const router = express.Router()

router.post('/stripepay',isLoggedIn, captureStripePayment)
router.post('/razorpay',isLoggedIn, captureRazorPayment)

export default router