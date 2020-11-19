import { Builder } from '../..';
import { Connection } from '../connection/Connection';

test('match ret Query', () => {
  const builder = new Builder();

  builder
    .match(
      { indice: 'a', nodeProps: { name: 'Ginkoe' }, nodeKind: 'Summoner' },
      {
        indice: 'b',
        nodeProps: {
          name: 'FL Ayub',
        },
      }
    )
    .ret('a', 'b');

  const result = builder.Query;
  expect(result).toBe(
    `MATCH (a:Summoner { name: 'Ginkoe' }), (b { name: 'FL Ayub' }) RETURN a, b`
  );
});

test('match delete query', () => {
  const builder = new Builder();

  builder
    .match(
      { indice: 'a', nodeProps: { name: 'Ginkoe' }, nodeKind: 'Summoner' },
      {
        indice: 'b',
        nodeProps: {
          name: 'FL Ayub',
        },
      }
    )
    .del('a', 'b');

  const result = builder.Query;
  expect(result).toBe(
    `MATCH (a:Summoner { name: 'Ginkoe' }), (b { name: 'FL Ayub' }) DELETE DETACH a, b`
  );
});

test('create ret Query', () => {
  const builder = new Builder();

  builder
    .create(
      {
        indice: 'a',
        nodeKind: 'TestNodeA',
        nodeProps: {
          name: 'Meow',
        },
      },
      {
        indice: 'b',
        nodeProps: {
          name: 'Woaf',
        },
      }
    )
    .ret('a', 'b');

  const result = builder.Query;

  expect(result).toBe(
    `CREATE (a:TestNodeA { name: 'Meow' }), (b { name: 'Woaf' }) RETURN a, b`
  );
});

test('query simple create ret', async () => {
  const testConnection = new Connection({
    name: 'test',
    host: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'bigmilkers609',
    database: 'default',
  });

  await testConnection.connect();

  const builder = new Builder();

  builder
    .create(
      {
        indice: 'a',
        nodeKind: 'TestNodeA',
        nodeProps: {
          name: 'Meow',
        },
      },
      {
        indice: 'b',
        nodeProps: {
          name: 'Woaf',
        },
      }
    )
    .ret('a', 'b');

  const result = await builder.execute(testConnection);
  expect(result).not.toBeUndefined();
});
