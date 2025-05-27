import { Injectable } from '@nestjs/common';
import { User } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository {
  private users: User[] = [];

  create(user: Omit<User, 'id' | 'version' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      id: uuidv4(),
      ...user,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, data: Partial<User>): User | undefined {
    const user = this.findById(id);
    if (user) {
      Object.assign(user, {
        ...data,
        version: user.version + 1,
        updatedAt: Date.now(),
      });
      return user;
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
