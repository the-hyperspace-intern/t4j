import { Builder, WhereSymbols } from '../..';
import { Connection } from '../connection/Connection';

const testConnection = new Connection({
  name: 'test',
  host: 'bolt://localhost:7687',
  username: 'neo4j',
  password: 'bigmilkers609',
  database: 'default',
});

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
    `MATCH (a:Summoner { name: 'Ginkoe' }), (b { name: 'FL Ayub' }) DETACH DELETE a, b`
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
  await testConnection.close();
  expect(result).not.toBeUndefined();
});

test('create then fetch with where', async () => {
  await testConnection.connect();

  let builder = new Builder();

  const randomProp = Math.floor(Math.random() * 6);

  builder
    .create({
      indice: 'a',
      nodeKind: 'CreateFetchNode',
      nodeProps: {
        randomProp,
      },
    })
    .ret('ID(a) as ID');

  const response = await builder.execute(testConnection);
  const createdNodeId = response.records[0].get('ID');

  // Reset Builder
  builder = new Builder();
  builder
    .match({ indice: 'a' })
    .where('ID(a)', WhereSymbols.EQUAL, createdNodeId)
    .ret('a.randomProp as randomProp');

  const resultRandomProp = (
    await builder.execute(testConnection)
  ).records[0].get('randomProp');

  await testConnection.close();
  expect(resultRandomProp).toBe(randomProp);
});
