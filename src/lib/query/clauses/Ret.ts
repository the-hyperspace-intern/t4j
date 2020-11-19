import { Clause } from '../../../';

export class RetClause extends Clause {
  options: string[];

  /**
   *
   * @param indicies Indices or expression to return
   */
  constructor(...indices: string[]) {
    super();
    this.options = indices;
  }

  raw(): string {
    const raw = `RETURN ${this.options.join(', ')}`;
    return raw;
  }
}
