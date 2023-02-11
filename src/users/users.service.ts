import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = this.repository.create({ ...userDto });

    return await this.repository.save(user);
  }

  async findUser(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }

    return this.repository.findOneBy({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return this.repository.find();
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  async update(id: string, updatedUser: Partial<User>): Promise<User> {
    const user = await this.findUser(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found)`);
    }

    Object.assign(user, updatedUser);

    return this.repository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findUser(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found)`);
    }

    return this.repository.remove(user);
  }
}
