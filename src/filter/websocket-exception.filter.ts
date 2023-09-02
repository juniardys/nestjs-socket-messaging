import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient() as Socket;
    const data = host.switchToWs().getData();
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    socket.emit('error', {
      id: socket.id,
      rid: data.rid,
      ...details,
    });
  }
}
