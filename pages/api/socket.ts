import { Server as IOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server } from 'http';
import { setSocketServer } from '@/lib/socket-server';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: Server & { io?: IOServer };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: '/api/socket',
      cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
      socket.on('join', ({ projectId }) => {
        if (projectId) {
          socket.join(projectId);
        }
      });
    });

    res.socket.server.io = io;
    setSocketServer(io);
  } else {
    setSocketServer(res.socket.server.io);
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false
  }
};
