import mongoose, { Connection } from 'mongoose';

// Connection cache to maintain single connections
const connections: { [key: string]: Connection } = {};

/**
 * Get MongoDB connection for d-admin database (main user management)
 */
export async function getAdminConnection(): Promise<Connection> {
  if (connections['admin'] && connections['admin'].readyState === 1) {
    return connections['admin'];
  }

  const uri = process.env.MONGODB_URI!;
  const connection = mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  await connection.asPromise();
  connections['admin'] = connection;
  console.log('✅ Connected to d-admin database');
  
  return connection;
}

/**
 * Get MongoDB connection for d-admin-free database (shared read-only data for free users)
 */
export async function getFreeConnection(): Promise<Connection> {
  if (connections['free'] && connections['free'].readyState === 1) {
    return connections['free'];
  }

  const baseUri = process.env.MONGODB_URI!;
  const uri = baseUri.replace(/\/[^\/]+\?/, '/d-admin-free?');
  
  const connection = mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  await connection.asPromise();
  connections['free'] = connection;
  console.log('✅ Connected to d-admin-free database');
  
  return connection;
}

/**
 * Get MongoDB connection for user-specific database (paid users: Pro/Max)
 * Each paid user gets their own isolated database named after their account
 */
export async function getUserConnection(accountName: string): Promise<Connection> {
  const connectionKey = `user_${accountName}`;
  
  if (connections[connectionKey] && connections[connectionKey].readyState === 1) {
    return connections[connectionKey];
  }

  const baseUri = process.env.MONGODB_URI!;
  const dbName = `d-${accountName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const uri = baseUri.replace(/\/[^\/]+\?/, `/${dbName}?`);
  
  const connection = mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  await connection.asPromise();
  connections[connectionKey] = connection;
  console.log(`✅ Connected to user database: ${dbName}`);
  
  return connection;
}

/**
 * Close all database connections
 */
export async function closeAllConnections(): Promise<void> {
  for (const [key, connection] of Object.entries(connections)) {
    if (connection.readyState === 1) {
      await connection.close();
      console.log(`🔌 Closed connection: ${key}`);
    }
  }
}

/**
 * Get connection based on user plan
 */
export async function getConnectionByPlan(plan: string, accountName?: string): Promise<Connection> {
  if (plan === 'free') {
    return getFreeConnection();
  } else if ((plan === 'pro' || plan === 'max') && accountName) {
    return getUserConnection(accountName);
  }
  
  throw new Error('Invalid plan or missing account name for paid plan');
}
