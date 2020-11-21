import { RELATION_ENTITY_METADATA_KEY } from '../decorator/RelationEntity';
import { RELATION_PROP_METADATA_KEY } from '../decorator/RelationProp';
import { BaseNodeEntity } from './BaseNodeEntity';

type RelationDirection = 'uni' | 'bi';

export class BaseRelationEntity {
  readonly id: number;

  /**
   * Gets the custom type of the Relation that will be used in the cypher query
   *
   * @returns Either constructor's name or custom name if defined
   */
  protected _getRelationType(): string {
    const _reflectedName = Reflect.getMetadata(
      RELATION_ENTITY_METADATA_KEY,
      this
    );
    return _reflectedName;
  }
  /**
   * Extracts Decorated props
   * @param entity BaseRelationEntity
   *
   * @returns a Partial of the entity with only the decorated props
   */
  static findProps<T extends BaseRelationEntity>(entity: T): Partial<T> {
    const props = {};
    Object.keys(entity).forEach((prop) => {
      if (Reflect.getMetadata(RELATION_PROP_METADATA_KEY, entity, prop))
        props[prop] = entity[prop];
    });

    return props;
  }

  link(a: BaseNodeEntity, b: BaseNodeEntity, direction: RelationDirection) {
    //TODO: Query Create Relation
  }
}
