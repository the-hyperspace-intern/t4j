export const NODE_ENTITY_METADATA_KEY = '4jNodeName';

/**
 * Makes the OGM consider the Class as a NodeEntity
 * @param name
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
export function NodeEntity(name?: string): ClassDecorator {
  return function (target): void {
    const _className = name ?? target.name;

    Reflect.defineMetadata(
      NODE_ENTITY_METADATA_KEY,
      _className,
      target.prototype
    );
  };
}
