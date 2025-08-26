// src/utils/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Employee from '../infrastructure/db/models/employee.model'
import { StatusCode } from "../shared/enums/statusCode";
import { RequestHandler } from 'express';
import dotenv from 'dotenv';
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

interface TokenPayload {
  userId: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "24h",
  });
};

// Generate Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "7d",
  });
};

// Verify Token Middleware
export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.token) {
    return res.status(StatusCode.UNAUTHORIZED).json({ error: "Authorization token required" });
  }

  const token = req.session.token;

  jwt.verify(
    token,
    SECRET_KEY,
    (err: jwt.VerifyErrors | null, decoded: unknown) => {
      if (err) {
        console.error("JWT verification error:", err);
        req.session.token = undefined;
        return res.status(StatusCode.UNAUTHORIZED).json({
          error:
            err.name === "TokenExpiredError"
              ? "Token expired"
              : "Invalid token",
        });
      }

      if (decoded && typeof decoded === "object") {
        req.user = decoded as TokenPayload;
        return next();
      }

      req.session.token = undefined;
      return res.status(StatusCode.UNAUTHORIZED).json({ error: "Invalid token payload" });
    }
  );
};


export const verifyToken = async  (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || 
                 req.header('Authorization')?.replace('Bearer ', '') || 
                 req.session?.token;
    if (!token || typeof token !== 'string') {
      req.session.token = undefined;
      
       res.status(StatusCode.UNAUTHORIZED).json({ success: false, error: 'Authorization token required' });
      return;
    }
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err.name, err.message);
        req.session.token = undefined;
        res.clearCookie('accessToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        const errorMessage = err.name === 'TokenExpiredError' 
          ? 'Token expired. Please login again.' 
          : 'Invalid token. Please authenticate.';
         res.status(StatusCode.UNAUTHORIZED).json({ success: false, error: errorMessage, shouldLogout: true });
         return
      }

      if (decoded && typeof decoded === 'object') {
        const payload = decoded as TokenPayload;
        if(payload.role == 'mechanic' || payload.role == 'coordinator'){
          const employee = await Employee.findById(payload.userId);
            if (!employee || employee.isDeleted ) {
            return res.status(StatusCode.FORBIDDEN).json({
              success: false,
              error: 'Account deactivated by admin.',
              shouldLogout: true
            });
          }else if(!employee || employee.status == "inactive"){
              return res.status(StatusCode.FORBIDDEN).json({
              success: false,
              error: 'Account deactivated by admin.',
              shouldLogout: true
            });
          }
        }
        req.user = { userId: payload.userId, role: payload.role, email: payload.email };

        if (payload.exp && Date.now() >= payload.exp * 1000 - 300000) {
          const newToken = jwt.sign(
            { userId: payload.userId, role: payload.role, email: payload.email },
            SECRET_KEY,
            { expiresIn: '1h' }
          );
          res.cookie('accessToken', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
          });
          req.session.token = newToken;
        }

         next();
         return;
      }
      req.session.token = undefined;
      res.clearCookie('accessToken');
      res.status(StatusCode.UNAUTHORIZED).json({ success: false, error: 'Invalid token payload' });
    });
  } catch (error) {
    console.error('Error in verifyToken middleware:', error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Internal server error during authentication' });
    return;
  }
};


export const checkRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: `Requires role: ${roles.join(', ')}` });
      return;
    }
    next();
  };
};


