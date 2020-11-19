import { Connection } from './Connection';

it('connection to neo4J w/ correct auth', async () => {
  const testConnection = new Connection({
    name: 'test',
    host: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'bigmilkers609',
    database: 'default',
  });

  await expect(testConnection.connect()).resolves.not.toBeUndefined();
});

it('connection to neo4j w/ wrong auth', async () => {
  const testConnection = new Connection({
    name: 'test',
    host: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'wrongpassword',
    database: 'default',
  });

  await expect(testConnection.connect()).rejects.toThrow();
});
