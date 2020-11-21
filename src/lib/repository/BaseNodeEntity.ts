import { Builder, CreateOptions, WhereSymbols } from '../..';
import { getConnection } from '../../utils/platform';
import { NODE_ENTITY_METADATA_KEY } from '../decorator/NodeEntity';
import { NODE_PROP_METADATA_KEY } from '../decorator/NodeProp';
import { CannotDeleteNonFetchedNode } from '../error/CannotDeleteNonFetchedNode';

/**
 * BaseNodeEntity is the class from which any NodeEntity inherits
 */
export class BaseNodeEntity {
  readonly id: number;

  /**
   * Extracts Decorated props
   * @param entity BaseRelationEntity
   *
   * @returns a Partial of the entity with only the decorated props
   */
  static findProps<T extends BaseNodeEntity>(entity: T): Partial<T> {
    const props = {};
    Object.keys(entity).forEach((prop) => {
      if (Reflect.getMetadata(NODE_PROP_METADATA_KEY, entity, prop))
        props[prop] = entity[prop];
    });

    return props;
  }

  /**
   * Gets the custom type of the Node that will be used in the cypher query
   *
   * @returns Either constructor's name or custom name if defined
   */
  protected _getNodeType(): string {
    const _reflectedName = Reflect.getMetadata(NODE_ENTITY_METADATA_KEY, this);
    return _reflectedName;
  }

  async delete(): Promise<this> {
    if (!this.id) throw new CannotDeleteNonFetchedNode();
    const builder = new Builder();
    builder
      .match({ indice: 'a' })
      .where('ID(a)', WhereSymbols.EQUAL, this.id)
      .del('a');

    await builder.execute(getConnection());
    return this;
  }

  async save(): Promise<this> {
    const builder = new Builder();
    const createData: CreateOptions = {
      nodeKind: this._getNodeType(),
      indice: 'a',
      nodeProps: BaseNodeEntity.findProps(this),
    };
    builder.create(createData).ret('ID(a) as ID');
    const response = await builder.execute(getConnection());
    const id = response.records[0].get('ID');
    (this as unknown)['id'] = id;

    return this;
  }

  // TODO: Requires WHERE Clause
  /* async del(): Promise<this> {
    const builder = new Builder();
    builder.match({ indice: 'a' });
  } */
}
