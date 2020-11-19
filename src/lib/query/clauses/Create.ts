import { inspect } from 'util';

import { Clause } from '../../..';
import { randomIndice } from '../../../utils/platform';

import { MatchOptions } from './Match';

export type CreateOptions = MatchOptions;

/**
 * CreateClause
 * @remarks Only for Nodes and not for Relations
 */
export class CreateClause extends Clause {
  options: CreateOptions[];

  constructor(...createOptions: CreateOptions[]) {
    super();
    this.options = createOptions;
  }

  private _genRawProp({ indice, nodeProps, nodeKind }: CreateOptions): string {
    indice = indice ?? randomIndice();
    this.indicesCollection.push(indice);

    const stringified = inspect(nodeProps);

    return `(${indice}${nodeKind ? `:${nodeKind}` : ''} ${
      stringified ?? '{}'
    })`;
  }

  raw(): string {
    const raw = `CREATE ${this.options
      .map((option) => this._genRawProp(option))
      .join(', ')}`;

    return raw;
  }
}
