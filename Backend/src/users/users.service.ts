import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      email: 'test@gmail.com',
      password: '123456',
      username: 'test',
    },
  ];

  findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}