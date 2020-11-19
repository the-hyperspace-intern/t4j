import { Clause } from '../../..';
import { NonVoidArray } from '../../common/ObjectType';

/**
 * Delete a node
 * @remarks
 * Also detach every relation
 */
export class DelClause extends Clause {
  /**
   * Indices
   */
  options: NonVoidArray<string>;
  constructor(...indices: NonVoidArray<string>) {
    super();
    this.options = indices;
  }

  raw(): string {
    return `DETACH DELETE ${this.options.join(', ')}`;
  }
}
