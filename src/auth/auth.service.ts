import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma.service';
import { createRpcException } from 'src/common/exceptions/create-rpc-exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

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
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }
}
