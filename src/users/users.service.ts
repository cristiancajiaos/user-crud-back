import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(term: string) {
    let user: User | null = null;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({id: term});
    } else {
      if (!user) {
        user = await this.userRepository.findOneBy({name: term});
      }
      if (!user) {
         user = await this.userRepository.findOneBy({email: term.toLowerCase().trim()});
      }
    }

    if (!user) {
      throw new NotFoundException(`User with term ${term} not found`);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    let user = this.findOne(id);

    await this.userRepository.delete(id);
    
    return {
      message: `User with ID ${id} deleted`
    }
  }

  private handleDBExceptions(error) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(error);
  } 
}
