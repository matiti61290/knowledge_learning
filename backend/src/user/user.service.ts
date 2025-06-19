import { Injectable} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    
    async getUserById(id){
        return this.userRepository.findOne({ where: { id },
        relations:[
            'purchases',
            'purchases.formation',
            'purchases.lesson',
            'progresses',
            'certificates'
        ]})
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    
}
