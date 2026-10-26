import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let adminApp: App | null = null;

export function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0]!;
    return adminApp;
  }

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      adminApp = initializeApp({
        projectId: configData.projectId,
      });
      return adminApp;
    }
  } catch (err) {
    console.warn('Firebase admin config load warning:', err);
  }

  adminApp = initializeApp();
  return adminApp;
}

export const adminAuth = () => getAuth(getAdminApp());
