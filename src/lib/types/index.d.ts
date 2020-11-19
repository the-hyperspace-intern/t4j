/* Neo4j */
interface NeoConnectionOptions {
  host: string;
  username: string;
  password: string;
  database: string;
}

/* Connection */
type ConnectionOptions = NeoConnectionOptions & {
  name: string;
};

type PrimitiveTypes = number | string | boolean | bigint | null | undefined;
