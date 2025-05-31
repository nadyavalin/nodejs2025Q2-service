import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, CreateUserDto, UpdatePasswordDto } from './interfaces';
import { UserRepository } from './user.repository';
import { validate as isUUID } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Login and password are required');
    }
    const saltRounds = parseInt(
      this.configService.get<string>('CRYPT_SALT') || '10',
      10,
    );
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = this.repository.create({ ...dto, password: hashedPassword });
    return plainToInstance(User, user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = this.repository.findAll();
    return users.map((user) => plainToInstance(User, user));
  }

  async findById(id: string): Promise<Omit<User, 'password'>> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(User, user);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const saltRounds = parseInt(
      this.configService.get<string>('CRYPT_SALT') || '10',
      10,
    );
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, salt);
    const updatedUser = this.repository.update(id, {
      password: hashedNewPassword,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(User, updatedUser);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
