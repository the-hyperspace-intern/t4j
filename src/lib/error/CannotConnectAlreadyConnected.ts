export class CannotConnectAlreadyConnected extends Error {
  name = 'CannotConnectAlreadyConnect';

  constructor(connectionName: string) {
    super();
    Object.setPrototypeOf(this, CannotConnectAlreadyConnected.prototype);
    this.message = `Cannot connect to the connection "${connectionName} because the connection is already connected"`;
  }
}
