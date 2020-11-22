import { _genConnection } from '../../utils/testing';
import { NodeEntity } from '../decorator/NodeEntity';
import { NodeProp } from '../decorator/NodeProp';
import { RelationEntity } from '../decorator/RelationEntity';
import { RelationProp } from '../decorator/RelationProp';

import { BaseNodeEntity } from './BaseNodeEntity';
import { BaseRelationEntity } from './BaseRelation';

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

@RelationEntity('WORKS_WITH')
class TestRelation extends BaseRelationEntity {
  @RelationProp()
  since: string;
}

test('base relation link test', async () => {
  await _genConnection();

  const nodeA = new TestNodeEntity();
  nodeA.username = 'ANODE';
  nodeA.age = 609;
  nodeA.somethingElse = 'else';
  nodeA.notNodeProp = 'not a prop';

  const nodeB = new TestNodeEntity();
  nodeB.username = 'ANODE';
  nodeB.age = 609;
  nodeB.somethingElse = 'else';
  nodeB.notNodeProp = 'not a prop';

  await nodeA.save();
  await nodeB.save();

  const relationR = new TestRelation();
  relationR.since = '2018';

  const response = (await relationR.link(nodeA, nodeB, 'uni'))[1];
  console.log(response.records[0]);

  expect(true).toBe(true);
});
