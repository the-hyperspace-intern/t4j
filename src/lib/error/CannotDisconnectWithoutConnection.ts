import { CannotConnectAlreadyConnected } from './CannotConnectAlreadyConnected';

export class CannotDisconnectWithoutConnection extends Error {
  name = 'CannotDisconnectWithoutConnection';

  constructor(connectionName: string) {
    super();
    Object.setPrototypeOf(this, CannotConnectAlreadyConnected.prototype);
    this.message = `Cannot disconnect the connection "${connectionName}" without it being connected`;
  }
}
