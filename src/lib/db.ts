import fs from 'node:fs';
import path from 'node:path';

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
  role: 'Superadmin' | 'Developer' | 'Client Pro' | 'Free User';
  status: 'active' | 'suspended' | 'pending';
  quota: number;
  projectsCount: number;
  joinedAt: string;
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

// --- PROJECTS DAO ---
export const ProjectsDB = {
  getAll(): ProjectData[] {
    if (!memoryProjects) {
      memoryProjects = readJsonFile<ProjectData[]>('projects.json', []);
    }
    return memoryProjects;
  },

  getById(id: string): ProjectData | undefined {
    const list = this.getAll();
    return list.find(p => p.id === id);
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
    return newProject;
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
    return updated;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter(p => p.id !== id);
    if (filtered.length === list.length) return false;

    memoryProjects = filtered;
    writeJsonFile('projects.json', filtered);
    return true;
  }
};

// --- USERS DAO ---
export const UsersDB = {
  getAll(): UserData[] {
    if (!memoryUsers) {
      memoryUsers = readJsonFile<UserData[]>('users.json', []);
    }
    return memoryUsers;
  },

  getByEmail(email: string): UserData | undefined {
    return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  create(userData: Omit<UserData, 'id' | 'joinedAt'>): UserData {
    const list = this.getAll();
    const newUser: UserData = {
      ...userData,
      id: `usr_${Date.now()}`,
      joinedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    list.push(newUser);
    memoryUsers = list;
    writeJsonFile('users.json', list);
    return newUser;
  },

  updateQuota(id: string, delta: number): UserData | null {
    const list = this.getAll();
    const user = list.find(u => u.id === id);
    if (!user) return null;

    user.quota = Math.max(0, user.quota + delta);
    memoryUsers = list;
    writeJsonFile('users.json', list);
    return user;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter(u => u.id !== id);
    if (filtered.length === list.length) return false;

    memoryUsers = filtered;
    writeJsonFile('users.json', filtered);
    return true;
  }
};

// --- SUBSCRIBERS DAO ---
export const SubscribersDB = {
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
    return { success: true, isNew: true };
  }
};

// --- SYSTEM CONFIG DAO ---
export const SystemConfigDB = {
  get(): SystemConfigData {
    if (!memoryConfig) {
      memoryConfig = readJsonFile<SystemConfigData>('system-config.json', {
        primaryModel: 'gemini-2.5-flash',
        fallbackModel: 'gemini-1.5-pro',
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

  update(updates: Partial<SystemConfigData>): SystemConfigData {
    const current = this.get();
    const updated: SystemConfigData = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    memoryConfig = updated;
    writeJsonFile('system-config.json', updated);
    return updated;
  }
};
