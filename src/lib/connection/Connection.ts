import { setConnection } from '../../utils/platform';
import { NeoDriver } from '../driver/DriverFactory';
import { CannotConnectAlreadyConnected } from '../error/CannotConnectAlreadyConnected';
import { CannotDisconnectWithoutConnection } from '../error/CannotDisconnectWithoutConnection';

/**
 * Connection is a single database OGM Connection to a specific database
 * For now you can only have one database connection at a time
 * @todo Make it possible to have a connection pool
 */
export class Connection {
  readonly name: string;

  readonly options: ConnectionOptions;

  readonly isConnected: boolean;

  readonly driver: NeoDriver;

  //TODO: Logger & EntityManager

  constructor(options: ConnectionOptions) {
    this.name = options.name || 'default';
    this.options = options;

    this.driver = new NeoDriver(this);
    this.isConnected = false;
  }

  /**
   * Performs connection to the database.
   * This method can only be called if the connection is not connected
   * @todo Push this connection to the pool stack
   */
  async connect(): Promise<this> {
    if (this.isConnected) throw new CannotConnectAlreadyConnected(this.name);

    await this.driver.connect();

    (this as unknown)['isConnected'] = true;

    setConnection(this);

    return this;
  }

  /**
   * Closes the connection with the database.
   * Once connection is closed cannot use Repositories or perfom any operation expect opening connection again.
   * This method can only be called if the connection is connected
   * @todo Pop this connection out of the pool stack
   */
  async close(): Promise<void> {
    if (!this.isConnected)
      throw new CannotDisconnectWithoutConnection(this.name);

    await this.driver.disconnect();
    (this as unknown)['isConnected'] = false;
    setConnection(undefined);
  }
}
