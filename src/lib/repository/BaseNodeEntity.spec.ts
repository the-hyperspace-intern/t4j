import { _genConnection } from '../../utils/testing';
import { Connection } from '../connection/Connection';
import { NodeEntity } from '../decorator/NodeEntity';
import { NodeProp } from '../decorator/NodeProp';

import { BaseNodeEntity } from './BaseNodeEntity';

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
  const testNode = new TestNodeEntity();
  testNode.username = genText();
  testNode.age = 609;
  testNode.somethingElse = 'else';
  testNode.notNodeProp = 'not a prop';
  const nodeProps = TestNodeEntity.findProps(testNode);

  expect(nodeProps).toStrictEqual({
    username: 'ginkoe',
    age: 609,
    somethingElse: 'else',
  });
});

test('create new node & delete it entity', async () => {
  const testConnection = await _genConnection();
  const countBeforeCreate = await _getNodeCount(testConnection);

  const testNode = new TestNodeEntity();
  testNode.username = 'ginkoe';
  testNode.age = 609;
  testNode.somethingElse = 'else';
  testNode.notNodeProp = 'not a prop';

  await testNode.save();
  const countAfterCreate = await _getNodeCount(testConnection);

  await testNode.delete();
  const countAfterDelete = await _getNodeCount(testConnection);

  expect(countBeforeCreate).toBe(countAfterCreate - 1);
  expect(countBeforeCreate).toBe(countAfterDelete);
});
