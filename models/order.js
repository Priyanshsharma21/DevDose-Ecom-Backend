import mongoose from 'mongoose'

const { Schema, model } = mongoose

const orderSchema = new Schema({
    shippingInfo : {
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        phoneNo : {
            type : String,
            required : true
        },
        postalCode : {
            type : String,
            required : true
        },
        state : {
            type: String,
            required : true
        },
        country : {
            type : String,
            required : true
        }
    },

    user : {
        type : Schema.ObjectId, // Schema.Types.ObjectId
        ref : 'User',
        required : true
    },

    orderItems : [
        {
            name : {
                type : String,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            },
            image : {
                type : String,
                required : true
            },
            price : {
                type:Number,
                required : true
            },
            product : {
                type : Schema.ObjectId,
                ref : 'Product',
                required : true
            }
        }
    ],

    paymentInfo : {
        id : {
            type :String
        }
    },

    taxAmount : {
        type : Number,
        required : true
    },

    shippingAmount : {
        type : Number,
        required : true
    },

    totalAmount : {
        type : Number,
        required : true
    },

    orderStatus : {
        type : String,
        required : true,
        default : 'processing'
    },

    deliveredAt : {
        type : Date,
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
})



const Order = model('Order',orderSchema)

export default Order