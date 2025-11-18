import type { Server as IOServer } from 'socket.io';

const SOCKET_SYMBOL = Symbol.for('codemakerSocket');

export function setSocketServer(server: IOServer) {
  (globalThis as any)[SOCKET_SYMBOL] = server;
}

export function getSocketServer(): IOServer | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  return (globalThis as any)[SOCKET_SYMBOL] as IOServer | undefined;
}
