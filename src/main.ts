import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketAdapter extends IoAdapter {
  private readonly configService: ConfigService;

  constructor(app: any) {
    super(app);
    this.configService = app.get(ConfigService);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const corsOrigin = this.configService.get<string>('CORS_ORIGIN');
    const corsMethods = this.configService.get<string>('CORS_METHODS', 'GET,POST'); // 'GET,POST' por defecto si no se define

    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: corsOrigin,
        methods: corsMethods.split(','), // Convierte la cadena en un array de métodos
        credentials: true,
      },
    });

    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const corsMethods = configService.get<string>('CORS_METHODS');
  const apiPort = configService.get<number>('API_PORT');

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors({
    origin: corsOrigin,
    methods: corsMethods
  });
  app.useWebSocketAdapter(new SocketAdapter(app))
  
  await app.listen(apiPort);
}
bootstrap();
