import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role: string;
    name?: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const demoRoleHeader = req.headers['x-demo-role'] as string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decoded = await adminAuth().verifyIdToken(idToken);
      
      // Look up role in users table, or default
      let userRole = 'Counsellor';
      try {
        const existingUsers = await db.select().from(users).where(eq(users.uid, decoded.uid)).limit(1);
        if (existingUsers.length > 0) {
          userRole = existingUsers[0].role;
        } else {
          // Auto-provision user record
          await db.insert(users).values({
            uid: decoded.uid,
            email: decoded.email || 'unknown@elvariq.edu',
            displayName: decoded.name || decoded.email || 'Staff User',
            role: userRole,
          }).onConflictDoNothing();
        }
      } catch (dbErr) {
        console.warn('Could not query users table during auth:', dbErr);
      }

      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        role: userRole,
      };
      return next();
    } catch (err) {
      console.warn('Bearer token verification failed:', err);
    }
  }

  // Fallback to active demo role header or default to Manager for academic evaluation
  req.user = {
    uid: 'demo-staff-user',
    email: 'counsellor@elvariq.edu',
    name: 'Demonstrator',
    role: demoRoleHeader || 'Manager',
  };

  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role`,
        userRole: req.user.role,
      });
    }

    next();
  };
}
