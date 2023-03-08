import express from 'express'
import { greetMessage } from '../controllers/home.js'

const router = express.Router()


router.get('/', greetMessage)



export default router