import BigPromise from '../middlewares/bigPromise.js'
import Product from '../models/product.js'
import CustomError from '../utils/customError.js'
import stripe from 'stripe';
import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
const app = express();
import razorpay from "razorpay"
import { v4 as uuidv4 } from 'uuid';

const {
    RAZOR_KEY,
    RAZOR_SECRET,
    STRIPE_SECRET
} = process.env

const stripeApi = stripe(STRIPE_SECRET);


export const captureStripePayment = BigPromise(async (req, res, next) => {
    const paymentIntent = await stripeApi.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',

        // optional data
        metadata: {
            integration_check: 'accept_a_payment'
        }
    })


    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})


export const captureRazorPayment = BigPromise(async (req, res, next) => {
    const razorInstance = new razorpay({
        key_id: RAZOR_KEY,
        key_secret:RAZOR_SECRET
    });
    
    const options = {
        amount: req.body.amount * 100,
        currency : 'INR',
        receipt: uuidv4(),
    };

    const order = await razorInstance.orders.create(options);

    res.status(200).json({
        success : true,
        id: response.id,
        currency: order.currency,
        amount: order.amount,
        order : order
    });

})