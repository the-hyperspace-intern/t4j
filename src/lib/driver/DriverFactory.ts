import { Driver, Session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';

import { Connection } from '../connection/Connection';
import { CouldNotEstablishConnection } from '../error/CouldNotEstablishConnection';

/**
 * Wrapper around the Neo4J Driver
 * Plugs to the connection and let you run direct queries
 */
export class NeoDriver {
  connection: Connection;
  options: NeoConnectionOptions;
  database: string;
  driver: Driver;
  session: Session;

  constructor(connection: Connection) {
    this.connection = connection;
    this.options = {
      ...connection.options,
    } as NeoConnectionOptions;

    this.database = this.options.database;
  }

  /**
   * Opens Connection and runs a test query to check if everything is fine
   */
  async connect(): Promise<void> {
    this.driver = neo4j.driver(
      this.options.host,
      neo4j.auth.basic(this.options.username, this.options.password),
      { disableLosslessIntegers: true }
    );
    try {
      this.session = this.driver.session();
      // Test Connection
      await this.session.run(
        'MATCH (n) RETURN n ORDER BY n.created_at desc LIMIT 1'
      );
    } catch (err) {
      this.driver.close();
      this.session.close();

      throw new CouldNotEstablishConnection(err.code);
    }

    return;
  }

  /**
   * Closes Connection
   */
  async disconnect(): Promise<void> {
    await this.session.close();
    await this.driver.close();
  }

  async wipe(): Promise<void> {
    await this.session.run(`MATCH (e) DETACH DELETE e`);
  }
}
