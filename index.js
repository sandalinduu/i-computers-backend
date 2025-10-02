import express from "express"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoutes.js"
// import { authMiddleware } from "./middleware/authMiddleware.js"
import productRoutes from "./routes/productsRoutes.js"
import jwt from "jsonwebtoken"


const mongoURL = "mongodb+srv://myUser:MyPass123@cluster0.mp8wnka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoURL).then(()=>{
    console.log("db id connected")
})
const app = express()
app.use(express.json());
// app.use(authMiddleware)
app.use(
    (req,res,next)=>{

        const authorizationHeader = req.header("Authorization")

        if(authorizationHeader != null){

            const token = authorizationHeader.replace("Bearer ", "")
 

            jwt.verify(token, "secritekey#22",
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

app.use("/users",userRoutes)
app.use("/products",productRoutes)


app.listen(3000,()=>{
    console.log("sever is runnig")

})