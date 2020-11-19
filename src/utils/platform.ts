import { Connection } from '../lib/connection/Connection';

export function randomIndice(length = 5): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function getGlobalVariable(): unknown {
  // eslint-disable-next-line no-undef
  return global;
}

//Todo: Make it pool connection
export function setConnection(connection?: Connection): void {
  const globalScope = getGlobalVariable();
  globalScope['type4jConnection'] = connection;
}

export function getConnection(): Connection {
  const globalScope = getGlobalVariable();
  return globalScope['type4jConnection'] as Connection;
}
