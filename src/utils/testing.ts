import { Connection } from '../lib/connection/Connection';

export async function _genConnection(): Promise<Connection> {
  const testConnection = new Connection({
    name: 'test',
    host: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'bigmilkers609',
    database: 'default',
  });

  await testConnection.connect();
  return testConnection;
}
