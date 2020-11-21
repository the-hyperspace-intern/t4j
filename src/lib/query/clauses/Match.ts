import { inspect } from 'util';

import { Clause } from '../../../';
import { randomIndice } from '../../../utils/platform';

export type UnknownNodeProps = Record<string, unknown>;

export interface MatchOptions {
  nodeKind?: string;
  nodeProps?: UnknownNodeProps;
  indice: string;
}

export class MatchClause extends Clause {
  options: MatchOptions[];
  constructor(...options: MatchOptions[]) {
    super();
    this.options = options;
  }

  /**
   *
   * @param param0 {indice, nodeProps, nodeKind}
   */
  private _genRawProp({ indice, nodeProps, nodeKind }: MatchOptions): string {
    indice = indice ?? randomIndice();
    this.indicesCollection.push(indice);

    const stringified = inspect(nodeProps);

    return `(${indice}${nodeKind ? `:${nodeKind}` : ''} ${
      nodeProps ? stringified : '{}'
    })`;
  }

  raw(): string {
    const options = this.options;
    const raw = `MATCH ${options
      .map((option) => this._genRawProp(option))
      .join(', ')}`;
    return raw;
  }
}
