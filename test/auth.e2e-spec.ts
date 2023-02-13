import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test_created@email.com', password: 'mypassword' })
      .expect(201);

    const { id, email } = response.body;
    expect(id).toBeDefined();
    expect(email).toEqual('test_created@email.com');
  });

  it('handles a signup request and then gets the currently logged in user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test_created@email.com', password: 'mypassword' })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();

    const whoAmIResponse = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(whoAmIResponse.body.email).toEqual('test_created@email.com');
  });
});
