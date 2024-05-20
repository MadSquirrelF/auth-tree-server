import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }
  
  @Get('init/:id')
  @Auth('USER')
  async getUserIdByUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.initById(id)
  }
}
