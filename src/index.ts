import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import rootRouter from './routers';
import { rootEventHandler } from './sockets';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/api/v1", rootRouter)
rootEventHandler(io)

server.listen(3000, () => {
  console.log('listening on *:3000');
});
