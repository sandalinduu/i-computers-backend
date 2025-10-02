import User from "../model/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export function createuser(req,res){

    const data = req.body
    const hashpassword = bcrypt.hashSync (data.password,10)

    // res.json({hashpassword})

    const user = new User({
        email : data.email,
        firstname : data.firstname,
        lastname : data.lastname,
        password : hashpassword,
        role : data.role
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

                    const token = jwt.sign(payload,"secritekey#22")

                    res.json({
                        message: "logging successfull",
                        token:token
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




export function isAdmin(req){
     if (req.user == null){

        return false

    }

    if (req.user.role != "admin"){
     
        return false
    }

    return true

}



// // ✅ Create a new user
// export const createUser = async (req, res) => {
//   try {
//     const { email, firstname, lastname, password, role, image } = req.body;

//     // check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists with this email" });
//     }

//     // hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // create user
//     const newUser = new User({
//       email,
//       firstname,
//       lastname,
//       password: hashedPassword,
//       role,
//       image
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User created successfully", user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user", error: error.message });
//   }
// };

// // ✅ User login
// export const userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // check user exist
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // If you plan to add JWT later, generate token here
//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };