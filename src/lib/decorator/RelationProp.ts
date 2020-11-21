export const RELATION_PROP_METADATA_KEY = 'isRelationProp';

/**
 * Makes the OGM consider the Prop as a visible one for the query builder
 */
export function RelationProp(): PropertyDecorator {
  return function (target, propKey): void {
    Reflect.defineMetadata('isRelationProp', true, target, propKey);
  };
}
