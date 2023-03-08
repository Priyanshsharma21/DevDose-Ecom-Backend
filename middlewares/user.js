/**
 * This middleware will give check if user loggedIn or not.
 */

import User from '../models/user.js'
import BigPromise from './bigPromise.js'
import CustomError from '../utils/customError.js'
import jwt from 'jsonwebtoken'

export const isLoggedIn = BigPromise(async(req,res,next)=>{
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", " ")


    if(!token) return next(new CustomError("Login first to access this page", 401))

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    const thisIsThatUser = await User.findById(decoded.id)

    // injucting new field(user) in req
    req.user = thisIsThatUser

    next()
})


// we are sending the string but to use array methods we are converting it to array
export const customRole = (...role)=>{

    return (req,res,next)=>{
        if(!role.includes(req.user.role)) return next(new CustomError("Not allowed to access this route", 401))
        next()
    }
}