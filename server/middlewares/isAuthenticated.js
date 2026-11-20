import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User is not authenticated.",
                success: false
            })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decode.userId;
        next();
    } catch (error) {
        // Expired or tampered token: respond instead of leaving the request hanging
        console.log(error.message);
        return res.status(401).json({
            message: "Session expired. Please log in again.",
            success: false
        })
    }
}
export default isAuthenticated;
