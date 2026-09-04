import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { usersSeed } from './data/data-seed';


@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService
  ) {

  }
  
  async executeSeed() {
    const users = usersSeed;
    try {
      this.userRepository.deleteAll();
      users.forEach(user => {
        this.usersService.create(user);
      })
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
    return `SEED EXECUTED`;
  }

}
