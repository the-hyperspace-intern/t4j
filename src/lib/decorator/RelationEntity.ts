export const RELATION_ENTITY_METADATA_KEY = '4jRelationName';
/**
 * Makes the Relationship consider the class as a RelationShip
 * @param name
 */
export function RelationEntity(name?: string): ClassDecorator {
  return function (target): void {
    const _className = name ?? target.name;

    Reflect.defineMetadata('4jRelationName', _className, target.prototype);
  };
}
