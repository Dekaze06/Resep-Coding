import fs from 'node:fs';
import path from 'node:path';
import { getMongoDb, isMongoConfigured } from './mongodb.ts';

export interface ProjectData {
  id: string;
  name: string;
  category: string;
  mode: 'fullstack' | 'frontend' | 'prd';
  owner: string;
  status: 'Live' | 'Draft' | 'Building';
  isFeatured?: boolean;
  views?: number;
  prompt?: string;
  code?: string;
  prdContext?: string;
  architectureNodes?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider?: 'google' | 'email';
  role: 'Superadmin' | 'Gratis' | 'Pro' | 'Max' | string;
  status: 'active' | 'suspended' | 'pending';
  isVerified?: boolean;
  verificationToken?: string;
  verificationExpires?: number;
  quota: number;
  projectsCount: number;
  joinedAt: string;
  lastLoginAt?: string;
}

export interface SubscriberData {
  email: string;
  subscribedAt: string;
  source: string;
}

export interface SystemConfigData {
  primaryModel: string;
  fallbackModel: string;
  temperature: number;
  topP: number;
  systemStatus: string;
  maintenanceMode: boolean;
  edgeNodesCount: number;
  updatedAt: string;
}

// In-memory fallback caches
let memoryProjects: ProjectData[] | null = null;
let memoryUsers: UserData[] | null = null;
let memorySubscribers: SubscriberData[] | null = null;
let memoryConfig: SystemConfigData | null = null;

function getDataDir(): string {
  return path.resolve(process.cwd(), 'src/data');
}

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(getDataDir(), filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.warn(`[DB] Warning reading ${filename}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T): boolean {
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn(`[DB] Warning writing ${filename}:`, err);
    return false;
  }
}

// --- PROJECTS DAO (MongoDB + Local JSON Fallback) ---
export const ProjectsDB = {
  async getAllAsync(ownerEmail?: string): Promise<ProjectData[]> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const filter = ownerEmail ? { owner: new RegExp(`^${ownerEmail}$`, 'i') } : {};
          const items = await db.collection<ProjectData>('projects')
            .find(filter)
            .sort({ updatedAt: -1 })
            .toArray();
          return items.map(({ _id, ...rest }: any) => rest as ProjectData);
        }
      } catch (err) {
        console.warn('[MongoDB] Projects getAllAsync failed, using fallback:', err);
      }
    }
    const all = this.getAll();
    if (ownerEmail) {
      return all.filter(p => p.owner.toLowerCase() === ownerEmail.toLowerCase());
    }
    return all;
  },

  getAll(): ProjectData[] {
    if (!memoryProjects) {
      memoryProjects = readJsonFile<ProjectData[]>('projects.json', []);
    }
    return memoryProjects;
  },

  async getByIdAsync(id: string): Promise<ProjectData | undefined> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const item = await db.collection<ProjectData>('projects').findOne({ id });
          if (item) {
            const { _id, ...rest } = item as any;
            return rest as ProjectData;
          }
        }
      } catch (err) {
        console.warn('[MongoDB] Projects getByIdAsync failed:', err);
      }
    }
    return this.getById(id);
  },

  getById(id: string): ProjectData | undefined {
    const list = this.getAll();
    return list.find(p => p.id === id);
  },

  async createAsync(project: Omit<ProjectData, 'createdAt' | 'updatedAt'> & { id?: string }): Promise<ProjectData> {
    const now = new Date().toISOString();
    const newProject: ProjectData = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          await db.collection<ProjectData>('projects').insertOne(newProject as any);
        }
      } catch (err) {
        console.warn('[MongoDB] Projects createAsync failed:', err);
      }
    }

    // Always keep memory & file in sync as backup
    const list = this.getAll();
    list.unshift(newProject);
    memoryProjects = list;
    writeJsonFile('projects.json', list);

    return newProject;
  },

  create(project: Omit<ProjectData, 'createdAt' | 'updatedAt'> & { id?: string }): ProjectData {
    const list = this.getAll();
    const now = new Date().toISOString();
    const newProject: ProjectData = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    list.unshift(newProject);
    memoryProjects = list;
    writeJsonFile('projects.json', list);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('projects').insertOne(newProject as any).catch(console.warn);
      });
    }

    return newProject;
  },

  async updateAsync(id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> {
    const updated = this.update(id, updates);
    if (isMongoConfigured() && updated) {
      try {
        const db = await getMongoDb();
        if (db) {
          await db.collection('projects').updateOne({ id }, { $set: updated });
        }
      } catch (err) {
        console.warn('[MongoDB] Projects updateAsync failed:', err);
      }
    }
    return updated;
  },

  update(id: string, updates: Partial<ProjectData>): ProjectData | null {
    const list = this.getAll();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    memoryProjects = list;
    writeJsonFile('projects.json', list);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('projects').updateOne({ id }, { $set: updated }).catch(console.warn);
      });
    }

    return updated;
  },

  async deleteAsync(id: string): Promise<boolean> {
    const res = this.delete(id);
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          await db.collection('projects').deleteOne({ id });
        }
      } catch (err) {
        console.warn('[MongoDB] Projects deleteAsync failed:', err);
      }
    }
    return res;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter(p => p.id !== id);
    if (filtered.length === list.length) return false;

    memoryProjects = filtered;
    writeJsonFile('projects.json', filtered);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('projects').deleteOne({ id }).catch(console.warn);
      });
    }

    return true;
  }
};

// --- USERS DAO ---
export const UsersDB = {
  async getAllAsync(): Promise<UserData[]> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const items = await db.collection<UserData>('users').find({}).toArray();
          return items.map(({ _id, ...rest }: any) => rest as UserData);
        }
      } catch (err) {
        console.warn('[MongoDB] Users getAllAsync failed:', err);
      }
    }
    return this.getAll();
  },

  getAll(): UserData[] {
    if (!memoryUsers) {
      memoryUsers = readJsonFile<UserData[]>('users.json', []);
    }
    return memoryUsers;
  },

  async getByEmailAsync(email: string): Promise<UserData | undefined> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const user = await db.collection<UserData>('users').findOne({ email: new RegExp(`^${email}$`, 'i') });
          if (user) {
            const { _id, ...rest } = user as any;
            return rest as UserData;
          }
        }
      } catch (err) {
        console.warn('[MongoDB] Users getByEmailAsync failed:', err);
      }
    }
    return this.getByEmail(email);
  },

  getByEmail(email: string): UserData | undefined {
    return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async upsertGoogleUser(data: { name: string; email: string; avatar?: string }): Promise<UserData> {
    const existing = await this.getByEmailAsync(data.email);
    const now = new Date().toISOString();
    const adminEmails = (process.env.ADMIN_ALLOWED_EMAILS || 'dekaze08@gmail.com').toLowerCase().split(',').map(s => s.trim());
    const isSuperAdmin = adminEmails.includes(data.email.toLowerCase().trim());
    const defaultRole = isSuperAdmin ? 'Superadmin' : 'Gratis';

    if (existing) {
      const updated: UserData = {
        ...existing,
        name: data.name || existing.name,
        avatar: data.avatar || existing.avatar,
        role: isSuperAdmin ? 'Superadmin' : (existing.role || 'Gratis'),
        authProvider: 'google',
        lastLoginAt: now
      };
      await this.updateUser(existing.id, updated);
      return updated;
    }

    const newUser: UserData = {
      id: `usr_g_${Date.now()}`,
      name: data.name || data.email.split('@')[0],
      email: data.email,
      avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=27272a`,
      role: defaultRole,
      status: 'active',
      quota: isSuperAdmin ? 99999 : 1,
      projectsCount: 0,
      authProvider: 'google',
      joinedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastLoginAt: now
    };
    return this.create(newUser);
  },

  async updateUser(id: string, updates: Partial<UserData>): Promise<UserData | null> {
    const list = this.getAll();
    const idx = list.findIndex(u => u.id === id);
    if (idx === -1) {
      if (isMongoConfigured()) {
        try {
          const db = await getMongoDb();
          if (db) {
            await db.collection('users').updateOne({ id }, { $set: updates });
            const user = await db.collection<UserData>('users').findOne({ id });
            if (user) {
              const { _id, ...rest } = user as any;
              return rest as UserData;
            }
          }
        } catch (e) {}
      }
      return null;
    }

    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    memoryUsers = list;
    writeJsonFile('users.json', list);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('users').updateOne({ id }, { $set: updates }).catch(console.warn);
      });
    }

    return updated;
  },

  create(userData: Omit<UserData, 'id' | 'joinedAt'> & { id?: string; joinedAt?: string }): UserData {
    const list = this.getAll();
    const newUser: UserData = {
      ...userData,
      id: userData.id || `usr_${Date.now()}`,
      joinedAt: userData.joinedAt || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    list.push(newUser);
    memoryUsers = list;
    writeJsonFile('users.json', list);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('users').insertOne(newUser as any).catch(console.warn);
      });
    }

    return newUser;
  },

  updateQuota(id: string, delta: number): UserData | null {
    const list = this.getAll();
    const user = list.find(u => u.id === id);
    if (!user) return null;

    user.quota = Math.max(0, user.quota + delta);
    memoryUsers = list;
    writeJsonFile('users.json', list);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('users').updateOne({ id }, { $set: { quota: user.quota } }).catch(console.warn);
      });
    }

    return user;
  },

  async findByVerificationToken(token: string): Promise<UserData | null> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const user = await db.collection<UserData>('users').findOne({ verificationToken: token });
          if (user) {
            const { _id, ...rest } = user as any;
            return rest as UserData;
          }
        }
      } catch (e) {
        console.warn('[DB] Error finding verification token in Mongo:', e);
      }
    }
    const list = this.getAll();
    return list.find(u => u.verificationToken === token) || null;
  },

  async verifyUser(token: string): Promise<UserData | null> {
    const user = await this.findByVerificationToken(token);
    if (!user) return null;

    if (user.verificationExpires && user.verificationExpires < Date.now()) {
      return null;
    }

    return await this.updateUser(user.id, {
      status: 'active',
      isVerified: true,
      verificationToken: undefined,
      verificationExpires: undefined
    });
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter(u => u.id !== id);
    if (filtered.length === list.length) return false;

    memoryUsers = filtered;
    writeJsonFile('users.json', filtered);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('users').deleteOne({ id }).catch(console.warn);
      });
    }

    return true;
  }
};

// --- SUBSCRIBERS DAO ---
export const SubscribersDB = {
  async getAllAsync(): Promise<SubscriberData[]> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const items = await db.collection<SubscriberData>('subscribers').find({}).toArray();
          return items.map(({ _id, ...rest }: any) => rest as SubscriberData);
        }
      } catch (err) {
        console.warn('[MongoDB] Subscribers getAllAsync failed:', err);
      }
    }
    return this.getAll();
  },

  getAll(): SubscriberData[] {
    if (!memorySubscribers) {
      memorySubscribers = readJsonFile<SubscriberData[]>('subscribers.json', []);
    }
    return memorySubscribers;
  },

  add(email: string, source: string = 'landing_cta'): { success: boolean; isNew: boolean } {
    const list = this.getAll();
    const exists = list.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: true, isNew: false };
    }

    const newSub: SubscriberData = {
      email,
      subscribedAt: new Date().toISOString(),
      source
    };
    list.push(newSub);
    memorySubscribers = list;
    writeJsonFile('subscribers.json', list);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('subscribers').insertOne(newSub as any).catch(console.warn);
      });
    }

    return { success: true, isNew: true };
  }
};

// --- SYSTEM CONFIG DAO ---
export const SystemConfigDB = {
  async getAsync(): Promise<SystemConfigData> {
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const config = await db.collection<SystemConfigData>('system_config').findOne({});
          if (config) {
            const { _id, ...rest } = config as any;
            return rest as SystemConfigData;
          }
        }
      } catch (err) {
        console.warn('[MongoDB] SystemConfig getAsync failed:', err);
      }
    }
    return this.get();
  },

  get(): SystemConfigData {
    if (!memoryConfig) {
      memoryConfig = readJsonFile<SystemConfigData>('system-config.json', {
        primaryModel: 'gemini-3.7-flash',
        fallbackModel: 'gemini-3.7-flash',
        temperature: 0.7,
        topP: 0.95,
        systemStatus: 'healthy',
        maintenanceMode: false,
        edgeNodesCount: 312,
        updatedAt: new Date().toISOString()
      });
    }
    return memoryConfig;
  },

  async updateAsync(updates: Partial<SystemConfigData>): Promise<SystemConfigData> {
    const updated = this.update(updates);
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          await db.collection('system_config').updateOne({}, { $set: updated }, { upsert: true });
        }
      } catch (err) {
        console.warn('[MongoDB] SystemConfig updateAsync failed:', err);
      }
    }
    return updated;
  },

  update(updates: Partial<SystemConfigData>): SystemConfigData {
    const current = this.get();
    const updated: SystemConfigData = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    memoryConfig = updated;
    writeJsonFile('system-config.json', updated);

    if (isMongoConfigured()) {
      getMongoDb().then(db => {
        db?.collection('system_config').updateOne({}, { $set: updated }, { upsert: true }).catch(console.warn);
      });
    }

    return updated;
  }
};
