const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = (req, res, next) => {
          try {
                    const authHeader = req.headers.authorization;

                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                              return res.status(401).json({ message: "No token provided" });
                    }

                    const token = authHeader.split(" ")[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    req.user = decoded; // attach user info to request

                    next();
          } catch (error) {
                    console.error("Auth Error:", error);
                    res.status(401).json({ message: "Invalid or expired token" });
          }
};
exports.Vendor_protect = async (req, res, next) => {
          try {
                    const authHeader = req.headers.authorization;

                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                              return res.status(401).json({ message: "No token provided" });
                    }

                    const token = authHeader.split(" ")[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    req.user = decoded; // attach user info to request
                    const role = await User.findById(req.user.id).select("role");
                    console.log(role);
                    if (role.role != "vendor") {
                              return res.status(401).json({ message: "Not have valid role" });
                    }

                    next();
          } catch (error) {
                    console.error("Auth Error:", error);
                    res.status(401).json({ message: "Invalid or expired token" });
          }
};
exports.admin_protect = (req, res, next) => {
          try {
                    const authHeader = req.headers.authorization;

                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                              return res.status(401).json({ message: "No token provided" });
                    }

                    const token = authHeader.split(" ")[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    req.user = decoded; // attach user info to request
                    if (req.user.role != "admin") {
                              return res.status(401).json({ message: "Not have valid role" });
                    }


                    next();
          } catch (error) {
                    console.error("Auth Error:", error);
                    res.status(401).json({ message: "Invalid or expired token" });
          }
};

