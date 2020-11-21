export const NODE_PROP_METADATA_KEY = 'isNodeProp';

/**
 * Makes the OGM consider the Prop as a visible one for the query builder
 * ```ts
 * @NodeEntity('myTestNode')
 * class TestNodeEntity extends BaseNodeEntity {
 *   @NodeProp()
 *   username: string;
 *
 *   @NodeProp()
 *   age: number;
 *
 *   @NodeProp()
 *   somethingElse: unknown;
 *
 *   notNodeProp: string;
 * }
 * ```
 */
export function NodeProp(): PropertyDecorator {
  return function (target, propKey: string): void {
    Reflect.defineMetadata('isNodeProp', true, target, propKey);
  };
}
