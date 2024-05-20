import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class UserService {

  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) { }

  async initById(_id: string) {
    const user = await this.UserModel.findById(_id)
    if (!user) throw new NotFoundException('Пользователь не найден')
    return this.returnUserFields(user)
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    }
  }
}
