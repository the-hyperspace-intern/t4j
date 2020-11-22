import { QueryResult } from 'neo4j-driver';

import { RelationDirection, WhereSymbols } from '../..';
import { getConnection } from '../../utils/platform';
import { RELATION_ENTITY_METADATA_KEY } from '../decorator/RelationEntity';
import { RELATION_PROP_METADATA_KEY } from '../decorator/RelationProp';
import { Builder } from '../query/builder';

import { BaseNodeEntity } from './BaseNodeEntity';

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

  //TODO: Bidirectional not working here
  async link(
    from: BaseNodeEntity,
    to: BaseNodeEntity,
    direction: RelationDirection
  ): Promise<[this, QueryResult]> {
    const builder = new Builder();
    builder
      .match({ indice: 'a' }, { indice: 'b' })
      .where('ID(a)', WhereSymbols.EQUAL, from.id)
      .andWhere('ID(b)', WhereSymbols.EQUAL, to.id)
      .create({ indice: 'a' })
      .withRelation({
        relation: {
          indice: 'r',
          relKind: this._getRelationType(),
          relProps: BaseRelationEntity.findProps(this),
        },
        direction: direction,
        toNode: { indice: 'b' },
      })
      .ret('r');

    const response = await builder.execute(getConnection());

    return [this, response];
  }

  // link(a: BaseNodeEntity, b: BaseNodeEntity, direction: RelationDirection) {
  //   //TODO: Query Create Relation
  // }
}
