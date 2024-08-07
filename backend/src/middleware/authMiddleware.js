const {User }= require('./../database/models')
const jwt = require("jsonwebtoken");


const protect = async (req, res, next) => {

  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
   
     // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          message:"Not authorized, please login",
        });
      }

      // Verify Token
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      // Get user id from token
      const user = await User.findOne({
        where: { id: verified.id }
      });
      if (!user) {
        return res.status(401).json({
          message: "Unauthenticated, please login",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthenticated, please login",        
      });
    }
  }
}

module.exports = protect;
   
