import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import * as dotenv from 'dotenv'
dotenv.config()


const { Schema, model } = mongoose;
const { JWT_SECRET,JWT_EXPIRY } = process.env;

const userSchema = new Schema({
    name : {
        type : String,
        required : [true, 'Please enter your full name'],
        maxLength : [40, 'Name should be less than 40 characters'],
    },

    email : {
        type : String,
        required : [true, 'Please enter your email address'],
        validators : [validator.isEmail, "Please enter email in correct format"],
        unique : true,
    },

    password : {
        type: String,
        required : [true, 'Please enter your password'],
        minLength : [7,'Password length should be greater than 7 characters'],
        select : false,        
    },

    role : {
        type : String,
        default : 'user',
    },

    photo : {
        id : {
            type : String,
            required : true
        },
        secure_url : {
            type : String,
            required : true
        }
    },

    forgotPasswordToken : String,
    forgotPasswordExpiry : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const {methods} = userSchema

//HOOKS - saving encrypt password before save -> Pre and post lifecycle  mongoose
userSchema.pre('save', async function(next){
    //now function will run only when password is modified
    if(!this.isModified('password')) return next
    this.password = await bcrypt.hash(this.password,10)
})



//METHODS
//Validate the password that user has given
methods.isValidatedPassword = async function(userSendPassword){
    return await bcrypt.compare(userSendPassword, this.password)
}

// create and return JWT token method
methods.getJwtToken = function(){
    return jwt.sign({id : this._id}, JWT_SECRET,{
        expiresIn : JWT_EXPIRY
    })
}


//generate forget password token aka string
methods.getForgotPasswordToken = function(){
    const randomString = crypto.randomBytes(20).toString('hex');
    // we will convert this string into hash.
    this.forgotPasswordToken = crypto.createHash('sha256').update(randomString).digest('hex');

    //Now after token we have to specify it's expiry.
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000

    //Now we will send randomString to user and when user will change the password then we will take that random string convert it into hash and compare it with this hash
    return randomString
}



const User = model('User',userSchema)

export default User