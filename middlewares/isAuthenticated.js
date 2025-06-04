import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.cookies.token;
            if(!token){
            return res.status(401).json({message:"User not authenticated",
                success:false
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };

        req._id = decode.userid;
        next();
    }catch(err){
        // console.log(err);
        // Handle JWT verification errors like expired token
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired",
                success: false
            });
        }

        // Handle any other errors
        console.error("Authentication error:", err);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        }); 
    }
}

export default isAuthenticated;