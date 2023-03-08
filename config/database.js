import mongoose from 'mongoose'


const connectDB = async(url)=>{
    try {
        mongoose.set('strictQuery', true)
        mongoose.connect(url,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        }).then(()=>{
            console.log("Connected to database")
        }).catch((error)=>{
            console.log("Something went wrong, can't connext to database")
            console.log(error)
            process.exit(1)
        })
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;