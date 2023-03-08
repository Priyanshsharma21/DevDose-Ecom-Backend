import BigPromise from '../middlewares/bigPromise.js'
import Product from '../models/product.js'
import CustomError from '../utils/customError.js'
import WhereClause from '../utils/whereClause.js'
import * as dotenv from 'dotenv'
import {
    v2 as cloudinary
} from 'cloudinary'
dotenv.config()


export const getAllProducts = BigPromise(async (req, res, next) => {
    const proObj = new WhereClause(Product.find(), req.query);

    proObj.search().filter().pager();

    const products = await proObj.base;


    res.status(200).json({
        success: true,
        products,
        // totalProductCount,
        // filteredProductCount,
    });

});

export const adminGetAllProducts = BigPromise(async (req, res, next) => {
    const products = await Product.find()

    res.status(200).json({
        success: true,
        products,
    });

});


export const getSingleProduct = BigPromise(async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findById(id)

    if (!product) {
        return next(new CustomError("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product,
    });

});


export const createProduct = BigPromise(async (req, res, next) => {
    const {
        name,
        description,
        price,
        photos,
        category,
        brand,
        stock,
        user
    } = req.body

    if (!name || !description || !price || !photos || !category || !brand || !stock) {
        return next(new CustomError('All fields are required', 400))
    }

    const imageArray = []

    for (let i = 0; i < photos.length; i++) {
        let photoUrl = await cloudinary.uploader.upload(photos[i], {
            folder: "products",
        })

        imageArray.push({
            id: photoUrl.public_id,
            secure_url: photoUrl.secure_url
        })
    }

    let updatedPhotos = imageArray;
    let updatedUser = req.user.id


    const product = await Product.create({
        name,
        description,
        price,
        brand,
        category,
        stock,
        photos: updatedPhotos,
        user: updatedUser
    })


    res.status(200).json({
        success: true,
        product: product
    })
})




export const updateSingleProduct = BigPromise(async (req, res, next) => {

    const id = req.params.id

    const foundProduct = await Product.findById(id)

    if (!foundProduct) return next(new CustomError('Product Not Found', 404))

    const updatedProduct = req.body

    if (req.body.photos.length !== 0) {

        const imageArray = []

        for (let i = 0; i < foundProduct.photos.length; i++) {
            const imageId = foundProduct.photos[i].id

            imageId ? await cloudinary.uploader.destroy(imageId) : await cloudinary.uploader.upload(req.body.photos[i], {
                folder: "products",
            })

            const photoUrl = await cloudinary.uploader.upload(req.body.photos[i], {
                folder: "products",
            })

            imageArray.push({
                id: photoUrl.public_id,
                secure_url: photoUrl.secure_url
            })
        }

        updatedProduct.photos = imageArray
    }

    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product: product
    })
});




export const deleteSingleProduct = BigPromise(async (req, res, next) => {

    const id = req.params.id

    const foundPro = await Product.findById(id)

    if (!foundPro) return next(new CustomError('Product Not Found', 404))


    for (let i = 0; i < foundPro.photos.length; i++) {
        const imageId = foundPro.photos[i].id
        await cloudinary.uploader.destroy(imageId)
    }


    const product = await Product.findByIdAndDelete(id)


    res.status(200).json({
        success: true,
        product: product,
        message: "Product Deleted"
    })
});




export const addReview = BigPromise(async (req, res, next) => {
    const {
        rating,
        comment,
        productId
    } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const alreadyReviewed = product.reviews.find((rev) => {
        return rev.user.toString() === req.user._id.toString()
    })


    if (alreadyReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }


    // average rating 
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length


    await product.save({validateBeforeSave : false})

    res.status(200).json({success : true, message : 'review added'})

});


export const deleteReview = BigPromise(async (req, res, next) => {
    const {productId} = req.query

    const product = await Product.findById(productId)

    const reviews = product.reviews.filer((review)=>{
        return review.user.toString() === req.user._id.toString()
    })

    product.numberOfReviews = reviews.length

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await Product.findByIdAndUpdate(productId, {reviews, ratings, numberOfReviews},{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    req.status(200).json({success : true})

});


export const getOnlyReviewsOneProduct = BigPromise(async (req, res, next) => {
    const {productId} = req.query

    const product = await Product.findById(productId)

    res.status(200).json({success : true, reviews : product.reviews})

});

