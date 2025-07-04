// // services/TokenService.ts
// import jwt from 'jsonwebtoken';

// interface TokenPayload {
//   id: string;
//   email: string;
//   position?: string;
// }

// interface TokenPair {
//   accessToken: string;
//   refreshToken: string;
// }

// export class TokenService {
//   private accessTokenSecret: string;
//   private refreshTokenSecret: string;
//   private accessTokenExpiry: string;
//   private refreshTokenExpiry: string;

//   constructor() {
//     this.accessTokenSecret = process.env.JWT_SECRET || 'default_access_secret';
//     this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default_refresh_secret';
//     this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
//     this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
//   }

//   generateTokenPair(payload: TokenPayload): TokenPair {
//     const accessToken = jwt.sign(
//       { 
//         ...payload, 
//         type: 'access' 
//       },
//       this.accessTokenSecret,
//       { 
//         expiresIn: this.accessTokenExpiry,
//         issuer: 'your-app-name',
//         audience: 'your-app-users'
//       }
//     );

//     const refreshToken = jwt.sign(
//       { 
//         ...payload, 
//         type: 'refresh' 
//       },
//       this.refreshTokenSecret,
//       { 
//         expiresIn: this.refreshTokenExpiry,
//         issuer: 'your-app-name',
//         audience: 'your-app-users'
//       }
//     );

//     return { accessToken, refreshToken };
//   }

//   verifyAccessToken(token: string): TokenPayload & { type: string } {
//     return jwt.verify(token, this.accessTokenSecret) as TokenPayload & { type: string };
//   }

//   verifyRefreshToken(token: string): TokenPayload & { type: string } {
//     return jwt.verify(token, this.refreshTokenSecret) as TokenPayload & { type: string };
//   }

//   generateAccessToken(payload: TokenPayload): string {
//     return jwt.sign(
//       { 
//         ...payload, 
//         type: 'access' 
//       },
//       this.accessTokenSecret,
//       { 
//         expiresIn: this.accessTokenExpiry,
//         issuer: 'your-app-name',
//         audience: 'your-app-users'
//       }
//     );
//   }

//   getTokenExpiry(token: string): number | null {
//     try {
//       const decoded = jwt.decode(token) as any;
//       return decoded?.exp || null;
//     } catch {
//       return null;
//     }
//   }
// }