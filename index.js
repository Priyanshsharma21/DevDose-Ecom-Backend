import app from './app.js'
import * as dotenv from 'dotenv'
import connectDB from './config/database.js'
import { v2 as cloudinary } from 'cloudinary'


const { CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET  } = process.env

cloudinary.config({
    cloud_name : CLOUDINARY_CLOUD_NAME,
    api_key : CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET,
})

dotenv.config()

const {PORT} = process.env

const startServer = ()=>{
    try {
        app.listen(PORT,()=>{
            connectDB(process.env.MONGODB_URL)
            console.log(`Running Up The Hill At ${PORT}km/hr`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()