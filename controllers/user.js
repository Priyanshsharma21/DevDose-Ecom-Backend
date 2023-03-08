import BigPromise from '../middlewares/bigPromise.js'
import User from '../models/user.js'
import CustomError from '../utils/customError.js'
import { cookieToken } from '../utils/cookieToken.js'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
dotenv.config()
import mailHelper from '../utils/emailHelper.js'




export const signUpGreet = async(req,res)=>{
    const allUsers = await User.find()
    res.status(200).json({success:true, users : allUsers})
}



export const signUp = BigPromise(async(req,res,next)=>{

    // let photoUrl;
    // if(req.files){
    //     const file = req.files.photo
    //     photoUrl = await cloudinary.uploader.upload(file,{
    //         folder : "users",
    //         width : 150,
    //         crop : "scale",
    //     })
    // }


    const {name, email, password, role,photo} = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo,{
                folder : "users",
                width : 150,
                crop : "scale",
    })


    if(!email || !name || !password){
        return next(new CustomError('Name Email & Password are required fields', 400))
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        photo : {
            id : photoUrl.public_id,
            secure_url : photoUrl.secure_url
        }
    })

    cookieToken(res,user)

})



export const login = BigPromise(async(req,res,next)=>{
    const { email, password } = req.body;

    if(!email || !password) return next(new CustomError('Please Provide Email & Password', 400))

    const user = await User.findOne({email}).select('+password')

    if(!user) return next(new CustomError('You are not registered', 400))

    const isUserValidated = user.isValidatedPassword(password)

    if(!isUserValidated) return next(new CustomError('Invailed Password', 400))

    cookieToken(res,user)
})



export const logout = BigPromise(async(req,res,next)=>{
    res.cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({success:true, message : "Logout Success"})
})


export const forgotPassword = BigPromise(async(req,res,next)=>{
   const { email } = req.body;

   const user = await User.findOne({email})

   if(!user) return next(new CustomError('No user found', 400))

   const forgotToken = user.getForgotPasswordToken();

   await user.save({validateBeforeSave : false})

   const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

   const message = `Visit this URL on your browser to reset your password ${myUrl} - Do Not stare this with anyone.`

   try {
        await mailHelper({
            email,
            textMessage : message,
            subject : "DevDose - Password Reset Mail"
        })

        res.status(200).json({
            success : true,
            message : "Email Send Successfully"
        })
   } catch (error) {
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined
    await user.save({validateBeforeSave : false})

    return next(new CustomError(error.message, 400))
   }
})



export const resetPassword = BigPromise(async(req,res,next)=>{
    const { password, confirmPassword } = req.body
    const token = req.params.token

    console.log({ password, confirmPassword })
    //this is not the token we will be comparing, we have to encrypt it and then compare it.
    const encryToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry : {$gt : Date.now()}
    })


    if(!user) return next(new CustomError('Token is invailed or expired', 400))


    // check if password and confirm password is same or not
    if(password !== confirmPassword) return next(new CustomError('Password and Conform Password do not match, try again', 400))


    user.password = password

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined
    await user.save({validateBeforeSave : false})


    cookieToken(res,user)

})


export const getLoggedInUserDetails = BigPromise(async(req,res,next)=>{
    console.log(req.user)
    //NOTE : req.user.id is injected by us.
    const user = await User.findById(req.user.id)

    res.status(200).json({success : true, user})
})  


export const changePassword = BigPromise(async(req,res,next)=>{
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id
    

    const user = await User.findById(userId).select("+password")

    const isOldPasswordCorrect = await user.isValidatedPassword(oldPassword)

    if(!isOldPasswordCorrect) return next(new CustomError('Password Incorrect', 400))

    user.password = newPassword

    await user.save()

    cookieToken(res,user)
})  



export const updateUserDetails = BigPromise(async(req,res,next)=>{
    const {name, email, photo} = req.body;

    if(!name || !email || !photo) return next(new CustomError('Name, email o photo missing', 404))


    const updatedUserData = {name,email};


    if(photo !==""){

        // if photo exist then destroy prev one from cloudinary and update it with new one
        const user = await User.findById(req.user.id)

        const imageId = user.photo.id

        const resp = await cloudinary.uploader.destroy(imageId)

        const photoUrl = await cloudinary.uploader.upload(photo,{
            folder : "users",
            width : 150,
            crop : "scale",
        })

        updatedUserData.photo = {
            id : photoUrl.public_id,
            secure_url : photoUrl.secure_url
        }
    }



    const user = await User.findByIdAndUpdate(req.user.id, updatedUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    });


    res.status(200).json({
        success : true,
        user
    })
 
})  


// admin is top level - so can see all the user data - It's me
export const adminAllUsers = BigPromise(async(req,res,next)=>{
    const users = await User.find()

    res.status(200).json({
        success : true,
        users : users
    })
})  



// manager can see only user data.
export const managerAllUsers = BigPromise(async(req,res,next)=>{
    const users = await User.find({role : 'user'})

    res.status(200).json({
        success : true,
        users : users
    })
})  


// manager can see only user data.
export const adminGetOneUser = BigPromise(async(req,res,next)=>{
    const id = req.params.id
    const users = await User.findById(id)

    if(!users) return next(new CustomError('No user found', 404))

    res.status(200).json({
        success : true,
        users : users
    })
})  


// manager can see only user data.
export const adminUpdateAnyUser = BigPromise(async(req,res,next)=>{


    const {name,email,photo,role} = req.body
    const id = req.params.id
    if(!name || !email || !photo || !role) return next(new CustomError('Name, email o photo missing', 404))


    const updateUser = {name,email,photo,role}



    if(photo !==""){

        // if photo exist then destroy prev one from cloudinary and update it with new one
        const user = await User.findById(id)

        const imageId = user.photo.id

        const resp = await cloudinary.uploader.destroy(imageId)

        const photoUrl = await cloudinary.uploader.upload(photo,{
            folder : "users",
            width : 150,
            crop : "scale",
        })

        updateUser.photo = {
            id : photoUrl.public_id,
            secure_url : photoUrl.secure_url
        }
    }

    console.log({id,name,email,photo,role})


    const user = await User.findByIdAndUpdate(id, updateUser,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    });


    res.status(200).json({
        success : true,
        user
    })
})  



export const adminDeletingOneUser = BigPromise(async(req,res,next)=>{
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)

    if(!user) return next(new CustomError('No user found', 404))

    res.status(200).json({
        success : true,
        message : "User Deleted Successfully",
        users : user
    })
})  