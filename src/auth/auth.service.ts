/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      name: 'Standard User',
      role: 'user',
    },
  ];

  login(loginDto: LoginDto) {
    if (!loginDto.username?.trim() || !loginDto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const matchedUser = this.users.find(
      (user) => user.username === loginDto.username,
    );

    if (!matchedUser || matchedUser.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const { password, ...safeUser } = matchedUser;

    return {
      message: 'Login successful',
      user: safeUser,
      token: this.buildToken(matchedUser),
    };
  }

  private buildToken(user: User): string {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      iat: Date.now(),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }
}
