import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const FakeUsersService: Partial<UsersService> = {
    findUser: (id: string): Promise<User | null> =>
      Promise.resolve({
        id,
        email: 'user@email.com',
        password: 'mypassword',
      } as User),

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

    remove: (id: string): Promise<User> => {
      return Promise.resolve({
        id,
        email: 'user@email.com',
        password: 'mypassword',
      } as User);
    },
  };

  const FakeAuthService: Partial<AuthService> = {
    signin: (email: string, password: string): Promise<User> => {
      return Promise.resolve({ id: '123', email, password } as User);
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: FakeUsersService },
        { provide: AuthService, useValue: FakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a single user with the given id', async () => {
    const user = await controller.findUser('123');
    expect(user).toEqual({
      id: '123',
      email: 'user@email.com',
      password: 'mypassword',
    });
  });

  it('should signin and return the user and updates sessions object', async () => {
    const session = {};
    const user = await controller.signin(
      { email: 'user@email.com', password: 'mypassword' },
      session,
    );
    expect(user).toEqual({
      id: '123',
      email: 'user@email.com',
      password: 'mypassword',
    });

    expect(session).toEqual({
      userId: '123',
    });
  });
});
