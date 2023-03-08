import express from 'express'
import cors from 'cors'
import greet from './routes/home.js'
import user from './routes/user.js'
import payment from './routes/payment.js'
import product from './routes/product.js'
import order from './routes/order.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express()

// swagger yaml docs

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// morgan middleware
app.use(morgan("tiny"))

// regular middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// cookies and file middlewares
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))


// router middlewares
app.use('/api/v1',greet)
app.use('/api/v1',user)
app.use('/api/v1',product)
app.use('/api/v1',payment)
app.use('/api/v1',order)


export default app