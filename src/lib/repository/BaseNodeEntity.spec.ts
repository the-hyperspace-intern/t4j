import { _genConnection } from '../../utils/testing';
import { Connection } from '../connection/Connection';
import { NodeEntity } from '../decorator/NodeEntity';
import { NodeProp } from '../decorator/NodeProp';
import { RelationEntity } from '../decorator/RelationEntity';
import { RelationProp } from '../decorator/RelationProp';

import { BaseNodeEntity } from './BaseNodeEntity';
import { BaseRelationEntity } from './BaseRelation';

async function _getNodeCount(connection: Connection): Promise<number> {
  const response = await connection.driver.session.run(
    'MATCH (e:myTestNode) RETURN count(e) as count'
  );

  const count = response.records[0].get('count');
  return count;
}

@NodeEntity('myTestNode')
class TestNodeEntity extends BaseNodeEntity {
  @NodeProp()
  username: string;

  @NodeProp()
  age: number;

  @NodeProp()
  somethingElse: unknown;

  notNodeProp: string;
}

function genText(): string {
  return 'ginkoe';
}

test('get decorated props base node entity', () => {
  const testNodeA = new TestNodeEntity();
  testNodeA.username = genText();
  testNodeA.age = 609;
  testNodeA.somethingElse = 'else';
  testNodeA.notNodeProp = 'not a prop';
  const nodeProps = TestNodeEntity.findProps(testNodeA);

  expect(nodeProps).toStrictEqual({
    username: 'ginkoe',
    age: 609,
    somethingElse: 'else',
  });
});

test('create new node & delete it entity', async () => {
  const testConnection = await _genConnection();
  const countBeforeCreate = await _getNodeCount(testConnection);

  const testNodeA = new TestNodeEntity();
  testNodeA.username = 'ginkoe';
  testNodeA.age = 609;
  testNodeA.somethingElse = 'else';
  testNodeA.notNodeProp = 'not a prop';

  await testNodeA.save();
  const countAfterCreate = await _getNodeCount(testConnection);

  await testNodeA.delete();
  const countAfterDelete = await _getNodeCount(testConnection);

  expect(countBeforeCreate).toBe(countAfterCreate - 1);
  expect(countBeforeCreate).toBe(countAfterDelete);
});

@RelationEntity('WORKS_WITH')
class TestRelation extends BaseRelationEntity {
  @RelationProp()
  since: string;
}

test('create two nodes and relation between', async () => {
  await _genConnection();

  const procedure = async (): Promise<string> => {
    try {
      const testNodeA = new TestNodeEntity();
      testNodeA.username = 'ginkoeNodeA';
      testNodeA.age = 609;
      testNodeA.somethingElse = 'else';
      testNodeA.notNodeProp = 'not a prop';
      await testNodeA.save();

      const testNodeB = new TestNodeEntity();
      testNodeB.username = 'ginkoeNodeB';
      testNodeB.age = 609;
      testNodeB.somethingElse = 'else';
      testNodeB.notNodeProp = 'not a prop';
      await testNodeB.save();

      const testRelation = new TestRelation();
      testRelation.since = '2019';

      await testNodeA.link(testRelation, testNodeB);
      return 'Success';
    } catch {
      return 'Failed';
    }
  };

  await expect(procedure()).resolves.toBe('Success');
});
