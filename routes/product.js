import express from 'express'
import { createProduct, getAllProducts,adminGetAllProducts,getSingleProduct, updateSingleProduct,deleteSingleProduct,addReview,deleteReview,getOnlyReviewsOneProduct } from '../controllers/product.js'
import { isLoggedIn,customRole }  from '../middlewares/user.js'
const router = express.Router();


// user route
router.get('/products', getAllProducts);
router.get('/product/:id', getSingleProduct);

router.put('/review',isLoggedIn, addReview);
router.delete('/review',isLoggedIn, deleteReview);
router.get('/reviews', getOnlyReviewsOneProduct);

// admin route
router.post('/admin/product/add',isLoggedIn, customRole("admin"), createProduct);
router.get('/admin/products',isLoggedIn, customRole("admin"), adminGetAllProducts);


router.put('/admin/product/:id',isLoggedIn, customRole("admin"), updateSingleProduct);
router.delete('/admin/product/:id',isLoggedIn, customRole("admin"), deleteSingleProduct);


export default router