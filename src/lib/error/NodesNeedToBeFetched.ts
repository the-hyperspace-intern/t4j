export class NodeNeedToBeFetched extends Error {
  name = 'NodeNeedToBeFetched';

  constructor(operationName: string, nodeName: string) {
    super();
    Object.setPrototypeOf(this, NodeNeedToBeFetched.prototype);
    this.message = `The operation ${operationName} needs the current Node ${nodeName} to be fetched first.`;
  }
}
