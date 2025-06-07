import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './interfaces';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(user: CreateUserDto & { password: string }): Promise<User> {
    const newUser = this.userRepo.create({
      ...user,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return this.userRepo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = await this.findById(id);
    if (user) {
      Object.assign(user, {
        ...data,
        version: user.version + 1,
        updatedAt: Date.now(),
      });
      return this.userRepo.save(user);
    }
    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return result.affected > 0;
  }
}
