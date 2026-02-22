import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Public } from './auth/decorators/public.decorator';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  getCurrentUser(@CurrentUser() user: Record<string, unknown> | undefined) {
    return {
      user,
    };
  }

  @Roles('admin')
  @Get('admin')
  getAdminStatus() {
    return {
      message: 'Admin access granted',
    };
  }
}
