import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const isAuthenticated = (req, res, next) => {
  // Check if the user has a valid token in the request header
  let token = req.header("Authorization");
  //console.log("token from isAuthenticated => ", token);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  token = token.split(" ")[1];
  // Verify the token and set the user in the request object
  try {
    const decoded = jwt.verify(token, process.env.LIVE_QUIZ_SECRET_KEY);
    console.log("decoded from isAuthenticated => ", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token, authorization denied" });
  }
};
