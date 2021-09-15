import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AppModule {}
