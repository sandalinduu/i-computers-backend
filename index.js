import express from "express"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoutes.js"
import cors from "cors"

import productRoutes from "./routes/productsRoutes.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import orderRoutes from "./routes/orderRoutes.js"


dotenv.config()             


const mongoURL = process.env.MONGU_URL
mongoose.connect(mongoURL).then(()=>{
    console.log("db id connected")
})
const app = express()
app.use(express.json());

app.use(cors())



app.use(
    (req,res,next)=>{

        const authorizationHeader = req.header("Authorization")

        if(authorizationHeader != null){

            const token = authorizationHeader.replace("Bearer ", "")
 

            jwt.verify(token,process.env.SECRET_KEY,
                (error, content)=>{

                    if(content == null){

                        console.log("invalid token")

                        res.json({
                            message : "invalid token"
                        })

                    }else{
                        
                        req.user = content

                        next()
                    }
                }
            )
        }else{
            next()
        }

    }
)

app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)


app.listen(3000 ,()=>{
    console.log("sever is runnig")

})


// gammk 