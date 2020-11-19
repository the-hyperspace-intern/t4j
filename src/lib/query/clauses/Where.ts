import { Clause } from '../../..';

type WhereArm = WhereOperator | PrimitiveTypes;

class WhereOperator {
  leftArm: WhereArm;
  rightArm: WhereArm;
}

export interface WhereOptions {
  prop: string;
  condition: WhereSymbols;
  value: PrimitiveTypes;
}

export enum WhereSymbols {
  BIGGER = '>',
  SMALLER = '<',
  EQUAL = '=',
}

export class WhereClause extends Clause {
  kindofWhere = 'WHERE';
  options: WhereOptions;

  constructor(key: string, condition: WhereSymbols, value: string) {
    super();
    this.options = {
      prop: key,
      condition,
      value,
    };
  }

  raw(): string {
    return `${this.kindofWhere} ${this.options.prop} ${this.options.condition} ${this.options.value}`;
  }
}

export class AndWhereClause extends WhereClause {
  kindofWhere = 'AND';

  constructor(key: string, condition: WhereSymbols, value: string) {
    super(key, condition, value);
  }
}

export class OrWhereClause extends WhereClause {
  kindofWhere = 'OR';

  constructor(key: string, condition: WhereSymbols, value: string) {
    super(key, condition, value);
  }
}

export class XorWhereClause extends WhereClause {
  kindofWhere = 'XOR';

  constructor(key: string, condition: WhereSymbols, value: string) {
    super(key, condition, value);
  }
}

// const example = {
//   name: OR('Ginkoe', 'NotGinkoe'),
// };
