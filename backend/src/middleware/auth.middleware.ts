
import jwt from 'jsonwebtoken';
// FIX: Import IUser for proper user typing
import User, { IUser } from '../models/User.js';
// FIX: Import Request directly to avoid type conflicts.
import { Request, Response, NextFunction } from 'express';

export interface RequestWithUser extends Request {
  // FIX: Use specific IUser type.
  user?: IUser | null;
}

const protect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
