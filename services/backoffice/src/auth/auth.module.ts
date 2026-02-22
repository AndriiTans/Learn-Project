import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserEntity } from './entities/auth-user.entity';
import { CognitoAuthGuard } from './guards/cognito-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthUsersService } from './services/auth-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthUserEntity])],
  providers: [
    AuthUsersService,
    {
      provide: APP_GUARD,
      useClass: CognitoAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})

export class AuthModule { }
