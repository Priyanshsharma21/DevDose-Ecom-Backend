import Order from '../models/order.js'
import BigPromise from '../middlewares/bigPromise.js'
import Product from '../models/product.js'
import CustomError from '../utils/customError.js'
import * as dotenv from 'dotenv'
import {
    v2 as cloudinary
} from 'cloudinary'
dotenv.config()


export const createorder = BigPromise(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo ,taxAmount,shippingAmount,totalAmount} = req.body

    const order = await Order.create({shippingInfo,orderItems,paymentInfo,taxAmount,shippingAmount,totalAmount, user : req.user._id})

    res.status(200).json({success: true, order})
})


export const getOneOrder = BigPromise(async(req,res,next)=>{
    const {id} = req.params

    const order = await Order.findById(id).populate("user", "name email")

    if(!order) return next(new CustomError("Plase check order id", 404))

    res.status(200).json({success: true, order})
})  

export const getLoggedInUserOrders = BigPromise(async(req,res,next)=>{

    const order = await Order.find({user : req.user._id})

    if(!order) return next(new CustomError("Plase check order id", 404))

    res.status(200).json({success: true, order})
})  

export const adminGetAllOrders = BigPromise(async(req,res,next)=>{

    const order = await Order.find()

    res.status(200).json({success: true, order})
})  


export const adminUpdateOrder = BigPromise(async(req,res,next)=>{
    const {id} = req.params

    const order = await Order.findById(id)

    if(order.orderStatus === "delivered") return next(new CustomError("order already delivered", 401))

    order.orderStatus = req.body.orderStatus

    order.orderItems.forEach(async(product)=>{
        updateProductStocks(product.product, product.quantity)
    })

    res.status(200).json({success: true, order})
})  


const updateProductStocks = async(productId, quantity)=>{
    const product = await Product.findById(productId);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave :false})
}



export const adminDeleteOrder = BigPromise(async(req,res,next)=>{

    const order = await Order.findByIdAndDelete(req.params.id)

    if(!order) return next(new CustomError("Can't delete, No such Order", 404))


    res.status(200).json({success: true,message : "Order Deleted", order})
})  
