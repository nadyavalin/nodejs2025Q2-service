import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
  }
}
