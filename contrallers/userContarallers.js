import User from "../model/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import fetch from "node-fetch"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config();


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export function createuser(req,res){

    const data = req.body
    const hashpassword = bcrypt.hashSync (data.password,10)

    // res.json({hashpassword})

    const user = new User({
        email : data.email,
        firstname : data.firstname,
        lastname : data.lastname,
        password : hashpassword,
        // role : data.role
    })

    user.save().then(
        ()=>{
            res.json({
                message:"user created successfully"
            })
        }
    )

}

export function logingUser(req,res){

    const email = req.body.email
    const password = req.body.password

    User.find({email : email}).then(
        (users)=>{
            if(users[0]== null){
                res.json({
                    message:"user not found"
                })
            }else{
                const user = users[0]
                // res.json(user) //adala kena pennawa saha json dekk eka para ekat response karn bari nis mek comment kare.

                const isPasswordCorrect = bcrypt.compareSync(password,user.password)
                if (isPasswordCorrect){
                    

                    const payload = {
                        email:user.email,
                        firstname:user.firstname,
                        lastname:user.lastname,
                        role:user.role,
                        isEmailverified : user.isemailverified,
                        Image:user.image
                    };

                    const token = jwt.sign(payload,process.env.SECRET_KEY,)

                    res.json({
                        message: "logging successfull",
                        token:token,
                        role:user.role

                    })



                }else{
                    res.json({
                        message:"logging error"
                    })
                }
            }

        }
    )


}

// --------------------------
// GOOGLE LOGIN
// --------------------------
export async function googleLogin(req, res) {
    const googleToken = req.body.token;
    console.log("Google token:", googleToken);

    if (!googleToken) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        // Verify token with Google
        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
            }
        );

        const googleUser = response.data;
        console.log("Google user data:", googleUser);

        // Check if user already exists
        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            // Create new user
            user = new User({
                email: googleUser.email,
                firstname: googleUser.given_name,
                lastname: googleUser.family_name,
                password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
                isemailverified: true,
                image: googleUser.picture,
            });

            await user.save();
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked. Contact admin." });
        }

        // Create JWT payload
        const payload = {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            isEmailVerified: user.isemailverified,
            image: user.image,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "150h" });

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            user: payload,
        });

    } catch (error) {
        console.error("Google login error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Google login failed",
            error: error.message,
        });
    }
}




export function isAdmin(req){
     if (req.user == null){

        return false

    }

    if (req.user.role != "admin"){
     
        return false
    }

    return true

}


export function getUser(req, res) {
	if (req.user == null) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}

	res.json(req.user);
}



