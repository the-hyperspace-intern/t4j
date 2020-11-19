import { QueryResult } from 'neo4j-driver';

import {
  AndWhereClause,
  CreateClause,
  CreateOptions,
  DelClause,
  MatchClause,
  MatchOptions,
  OrWhereClause,
  RetClause,
  WhereClause,
  WhereSymbols,
  XorWhereClause,
} from '../../';
import { NonVoidArray } from '../common/ObjectType';
import { Connection } from '../connection/Connection';

//TODO: SpecialClauses
export enum SpecialClause {
  START = 'start',
}

export abstract class Clause {
  head?: Clause | SpecialClause;
  options: unknown;
  //TODO: Indicates what Instance Node Type it is
  indicesCollection: string[] = [];

  abstract raw(): string;

  /**
   * Chains with a Match Clause
   *
   * @remarks
   * This method can only initial a stack query
   *
   * @param options - Kind of node, specific indice, props to Match
   */
  match(...options: MatchOptions[]): MatchClause {
    const clause = new MatchClause(...options);
    this.head = clause;
    return clause;
  }

  /**
   * Chains with a Match Clause
   *
   * @remarks
   * This method can only close a stack query
   *
   * @param indices - Indices or expressions to return
   */
  ret(...indices: NonVoidArray<string>): RetClause {
    const clause = new RetClause(...indices);
    this.head = clause;
    return clause;
  }

  /**
   * Create new Node
   *
   * @remarks
   * Cannot be used for creating new Relations
   *
   * @param options
   */
  create(...options: CreateOptions[]): CreateClause {
    const clause = new CreateClause(...options);
    this.head = clause;
    return clause;
  }

  /**
   * Delete nodes by indices
   * @param indices
   */
  del(...indices: NonVoidArray<string>): DelClause {
    const clause = new DelClause(...indices);
    this.head = clause;
    return;
  }

  where(
    key: string,
    condition: WhereSymbols,
    value: PrimitiveTypes
  ): WhereClause {
    const clause = new WhereClause(key, condition, value);
    this.head = clause;
    return clause;
  }

  andWhere(key: string, condition: WhereSymbols, value: string): WhereClause {
    const clause = new AndWhereClause(key, condition, value);
    this.head = clause;
    return clause;
  }

  orWhere(key: string, condition: WhereSymbols, value: string): WhereClause {
    const clause = new OrWhereClause(key, condition, value);
    this.head = clause;
    return clause;
  }

  xorWhere(key: string, condition: WhereSymbols, value: string): WhereClause {
    const clause = new XorWhereClause(key, condition, value);
    this.head = clause;
    return clause;
  }

  get Query(): string {
    let tail = this.head;
    let raw = '';

    while (tail != undefined) {
      if (this.head instanceof Clause) {
        tail = tail as Clause;
        raw += tail.raw() + ' ';
        tail = tail.head;
      } else {
        //TODO: Handle Special Clauses
        break;
      }
    }
    raw = raw.trimRight();
    return raw;
  }

  async execute(connection: Connection): Promise<QueryResult> {
    const response = await connection.driver.session.run(this.Query);
    return response;
  }

  /* 
  // with() {}
  // unwind
  // orderby
  // skip
  // limit
  // set
  // remove
  // foreach
  // merge
  // merge
  // call {}
  // CALL procedure
  */
}

/**
 * Empty Query Builder
 * Usually how you start a new query
 */
export class Builder extends Clause {
  raw(): string {
    return;
  }
}
