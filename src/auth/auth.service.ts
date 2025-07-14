import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma.service';
import { createRpcException } from 'src/common/exceptions/create-rpc-exception';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private signJwt(payload: AuthJwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createRpcException(HttpStatus.BAD_REQUEST, 'User already exists');
    }

    const newUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      },
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token: this.signJwt({ id: newUser.id, email: newUser.email }),
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw createRpcException(
        HttpStatus.BAD_REQUEST,
        'Email or password is not valid',
      );
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: this.signJwt({ id: user.id, email: user.email }),
    };
  }

  verifyToken(authToken: string) {
    try {
      const payload = this.jwtService.verify<AuthJwtPayload>(authToken, {
        secret: this.configService.get('jwt.secret'),
      });

      const user = {
        id: payload.id,
        email: payload.email,
      };

      return {
        user,
        token: this.signJwt(user),
      };
    } catch (error) {
      throw createRpcException(HttpStatus.UNAUTHORIZED, 'Invalid token');
    }
  }
}
