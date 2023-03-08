import mongoose from 'mongoose'

const { Schema, model} = mongoose

const productSchema = new Schema({
    name : {
        type : String,
        required : [true,"Please enter product name"],
        trim : true,
        maxLength : [120, "Product name should not be greater than 120 characters"]
    },
    description : {
        type : String,
        required : [true,"Please enter description of product"],
    },
    price : {
        type : Number,
        required : [true,"Please enter price of product"],
        maxLength : [6, "Product name should not be greater than 6 digits"]
    },
    photos : [
        {
            id : {
                type : String,
                required : true,
            },
            secure_url : {
                type : String,
                required : true,
            }
        }
    ],

    stock : {
        type : Number,
        required : true,
    },
    
    category : {
        type :String,
        required : [true,"Please enter category from following - ReactJs, Pro Backend, NextJs, Project-Dopamine"],
        enum : {
            values : [
                'reactJs',
                'pro backend',
                'nextJs',
                'dopamine',
                'fullstack'
            ],

            message : "Please select categories from give one only"
        }
    },

    brand : {
        type : String,
        required : [true,"Please enter brand name"]
    },

    ratings : {
        type : Number,
        // required : [true,"Please enter rating name"]
    },

    numberOfReviews : {
        type : Number,
        default : 0,
    },

    reviews : [
        {
            user : {
                type : Schema.ObjectId,
                ref : 'User',
                required : true,
                //it means user object Id
            },
            name : {
                type : String,
                required : true,
            },
            review : {
                type : Number,
                required : true,
            },
            comment : {
                type : String,
                required : true,
            }
        }
    ],

    user : {
        type : Schema.ObjectId,
        required : true,
        ref : 'User'
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
})

const Product = model('product',productSchema)


export default Product