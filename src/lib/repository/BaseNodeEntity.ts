import { Builder, CreateOptions } from '../..';
import { getConnection } from '../../utils/platform';

/**
 * BaseNodeEntity is the class from which any NodeEntity inherits
 */
export class BaseNodeEntity {
  readonly id: number;

  static findProps<T extends BaseNodeEntity>(entity: T): Partial<T> {
    const props = {};
    Object.keys(entity).forEach((prop) => {
      if (Reflect.getMetadata('isNodeProp', entity, prop))
        props[prop] = entity[prop];
    });

    return props;
  }

  protected _getNodeType(): string {
    const _reflectedName = Reflect.getMetadata('4jNodeName', this);
    return _reflectedName;
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
