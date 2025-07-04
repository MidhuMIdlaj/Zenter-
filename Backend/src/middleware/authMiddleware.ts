// src/utils/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-here";

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
    console.log("No token found in session");
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = req.session.token;

  jwt.verify(
    token,
    SECRET_KEY,
    (err: jwt.VerifyErrors | null, decoded: unknown) => {
      if (err) {
        console.error("JWT verification error:", err);
        req.session.token = undefined;
        return res.status(401).json({
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
      return res.status(401).json({ error: "Invalid token payload" });
    }
  );
};


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || 
                 req.header('Authorization')?.replace('Bearer ', '') || 
                 req.session?.token;
    if (!token || typeof token !== 'string') {
      req.session.token = undefined;
       res.status(401).json({ success: false, error: 'Authorization token required' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
       res.status(500).json({ success: false, error: 'Server configuration error' });
       return;
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
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
         res.status(401).json({ success: false, error: errorMessage, shouldLogout: true });
         return
      }

      if (decoded && typeof decoded === 'object') {
        const payload = decoded as TokenPayload;
        if (!payload.userId || !payload.role) {
           res.status(401).json({ success: false, error: 'Token missing required fields' });
           return
        }
        req.user = { userId: payload.userId, role: payload.role, email: payload.email };

        if (payload.exp && Date.now() >= payload.exp * 1000 - 300000) {
          const newToken = jwt.sign(
            { userId: payload.userId, role: payload.role, email: payload.email },
            jwtSecret,
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
       res.status(401).json({ success: false, error: 'Invalid token payload' });
      return;
    });
  } catch (error) {
    console.error('Error in verifyToken middleware:', error);
     res.status(500).json({ success: false, error: 'Internal server error during authentication' });
     return;
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authenticated' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Requires one of these roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};
