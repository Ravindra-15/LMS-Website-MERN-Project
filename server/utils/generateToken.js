import jwt from "jsonwebtoken";
export const generateToken = (res, user, message) => {
    // Never send the password hash back to the browser
    const { password, ...safeUser } = user.toObject ? user.toObject() : user;
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "100d"});
    return res.status(200).cookie("token", token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 100 * 24 * 60 * 60 * 1000 // for 100 days
    }).json({
        success: true,
        message,
        user: safeUser
    });
}