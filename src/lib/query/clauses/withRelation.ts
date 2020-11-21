import { inspect } from 'util';

import { Clause, MatchOptions, UnknownNodeProps } from '../../..';
import { randomIndice } from '../../../utils/platform';

type RelationDirection = 'uni' | 'bi';

interface RelationOptions {
  indice?: string;
  relKind: string;
  relProps?: UnknownNodeProps;
}

export interface WithRelationOptions {
  relation: RelationOptions;
  toNode: MatchOptions;
  direction: RelationDirection;
}

export class WithRelationClause extends Clause {
  options: WithRelationOptions;
  toTrim = true;
  constructor(option: WithRelationOptions) {
    super();
    this.options = option;
  }

  private _genRawNode({ toNode }: WithRelationOptions): string {
    const nodeIndice = toNode.indice ?? randomIndice();

    // Gen Raw Node
    const stringifiedNode = inspect(toNode.nodeProps);
    const rawNode = `(${nodeIndice}${
      toNode.nodeKind ? `:${toNode.nodeKind}` : ``
    } ${toNode.nodeProps ? stringifiedNode : '{}'})`;

    return rawNode;
  }

  private _genRawRelation({
    direction,
    relation,
  }: WithRelationOptions): string {
    const relationIndice = relation.indice ?? randomIndice();
    // Gen Raw Relation
    const stringifiedRel = inspect(relation.relProps);
    const rawRelation = `-[${relationIndice}:${relation.relKind} ${
      relation.relProps ? stringifiedRel : '{}'
    }]-${direction == 'bi' ? '' : '>'}`;

    return rawRelation;
  }

  raw(): string {
    return this._genRawRelation(this.options) + this._genRawNode(this.options);
  }
}
