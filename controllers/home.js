import BigPromise from '../middlewares/bigPromise.js'

export const greetMessage = BigPromise(async(req,res)=>{
    res.status(200).json({
        success:true,
        message : "Hello from DevDose API"
    })
})