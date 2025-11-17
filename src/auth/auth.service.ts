import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    if (!signupDto.username?.trim() || !signupDto.password?.trim()) {
      throw new BadRequestException('Username and password are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: signupDto.username.trim() },
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: signupDto.username.trim(),
        password: hashedPassword,
        name: signupDto.name?.trim() || signupDto.username.trim(),
      },
    });

    const payload = this.buildPayload(newUser);

    return {
      message: 'Signup successful',
      user: payload.user,
      token: await this.jwtService.signAsync(payload.tokenPayload),
    };
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.username?.trim() || !loginDto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const matchedUser = await this.prisma.user.findUnique({
      where: { username: loginDto.username.trim() },
    });

    if (!matchedUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      matchedUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = this.buildPayload(matchedUser);

    return {
      message: 'Login successful',
      user: payload.user,
      token: await this.jwtService.signAsync(payload.tokenPayload),
    };
  }

  private buildPayload(user: {
    id: number;
    username: string;
    role: string;
    name?: string | null;
  }) {
    const tokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    };

    const safeUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return { tokenPayload, user: safeUser };
  }
}
