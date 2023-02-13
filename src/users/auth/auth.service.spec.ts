import { UsersService } from './../users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const FakeUsersService: Partial<UsersService> = {
  createUser: (userDto: CreateUserDto): Promise<User> => {
    return Promise.resolve({ ...userDto } as User);
  },

  findUser: (id: string): Promise<User | null> => Promise.resolve(null),

  findAllUsers: (): Promise<User[]> => Promise.resolve([]),

  findByEmail: (email: string): Promise<User | null> => {
    if (email === 'existent@email.com') {
      return Promise.resolve({ email } as User);
    }

    if (email === 'user@email.com')
      return Promise.resolve({
        id: '123abc',
        email: 'user@email.com',
        password:
          '9b5af0db711b900d.07895f6ad111ac3cbcc0e8f02c9685e6a5cf83d079c0dc940ce62312705a838e',
      } as User);
  },

  update: (id: string, updatedUser: Partial<User>): Promise<User> => {
    return Promise.resolve(new User());
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: FakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test');
    expect(user.email).toEqual('test@test.com');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if user signs up with existent email', async () => {
    await expect(async () =>
      service.signup('existent@email.com', 'test'),
    ).rejects.toThrow(new BadRequestException('Email already in use'));
  });

  it('should throw an error if user signs in with inexistent email', async () => {
    await expect(async () =>
      service.signin('inexistent@email.com', 'test'),
    ).rejects.toThrow(new NotFoundException('User does not exist'));
  });

  it('should throw an error if user signs in with invalid password', async () => {
    await expect(async () =>
      service.signin('user@email.com', 'test'),
    ).rejects.toThrow(new BadRequestException('incorrect password'));
  });

  it('should return a user if correct credentials are provided', async () => {
    const user = await service.signin('user@email.com', 'validpassword');

    expect(user).toBeDefined();
  });
});
