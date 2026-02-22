import { Controller, Param, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { ShiftsService } from './shifts.service';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @Roles('admin')
  @Post(':shiftId/users/:userId')
  async assignUserToShift(
    @Param('shiftId') shiftId: string,
    @Param('userId') userId: string,
  ) {
    await this.shiftsService.assignUserToShift(shiftId, userId);
    return { message: 'User assigned to shift' };
  }
}
