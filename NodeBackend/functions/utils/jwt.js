// src/utils/jwt.js
import jwt from "jsonwebtoken";

export function signSession(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifySession(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
