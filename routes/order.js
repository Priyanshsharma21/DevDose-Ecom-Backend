import express from 'express'
import { isLoggedIn,customRole }  from '../middlewares/user.js'
import { createorder, getLoggedInUserOrders, getOneOrder,adminGetAllOrders, adminUpdateOrder, adminDeleteOrder } from '../controllers/order.js'

const router = express.Router()


router.post('/order/create',isLoggedIn, createorder)
router.get('/order/myorder',isLoggedIn,getLoggedInUserOrders)
router.get('/admin/orders',isLoggedIn,customRole("admin"),adminGetAllOrders)

router.get('/order/:id',isLoggedIn,getOneOrder)

router.put('/admin/order/:id',isLoggedIn,customRole("admin"),adminUpdateOrder)
router.delete('/admin/order/:id',isLoggedIn,customRole("admin"),adminDeleteOrder)



//order of route matters, always place dynamic id routes at last

export default router