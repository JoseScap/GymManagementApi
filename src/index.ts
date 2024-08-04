import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import rootRouter from './routers';
import { rootEventHandler } from './sockets';
import { AppDataSource } from './persistence/data-source';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/api/v1", rootRouter)
rootEventHandler(io)

AppDataSource
  .initialize()
  .then(() => server.listen(3000, () => {
    console.log('listening on *:3000');
  }))
  .catch((error) => {
    console.error('Error initializing DataSource:', error);
  });

