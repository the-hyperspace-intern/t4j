export class CannotDeleteNonFetchedNode extends Error {
  name = 'CannotDeleteNonFetchedNode';

  constructor() {
    super();
    Object.setPrototypeOf(this, CannotDeleteNonFetchedNode.prototype);
    this.message = `Cannot delete non fetched node, please fetch the node first.`;
  }
}
