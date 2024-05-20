import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { RefreshTokenDto } from './dto/refreshtoken.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
     private readonly jwtService: JwtService
  ) { }

  async issueTokenPair(UserId: string) {

    const data = { _id: UserId }

    const refreshToken = await this.jwtService.signAsync(data, { expiresIn: '15d' })
    
    const accessToken = await this.jwtService.signAsync(data, { expiresIn: '1h' })

    return { refreshToken, accessToken }
  }

    
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException("Please sign in!")

    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) throw new UnauthorizedException("Invalid token or expired!")
    const user = await this.UserModel.findById(result._id)
    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }

  }

  async validateUser(dto: LoginDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({ email: dto.email })

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль')
    }

    const isValidPassword = await compare(dto.password, user.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль')
    }

    return user
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)

    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async register(dto: RegisterDto) {
  
    // const recaptchaResponse = await axios.post(`https://smartcaptcha.yandexcloud.net/validate?secret=${process.env.YANDEX_CAPTCHA_SECRET_KEY}&token=${dto.token}`);

    // if (recaptchaResponse.data.status === 'failed') {
    //    throw new BadRequestException(recaptchaResponse.data.message);
    // }


    const oldUser = await this.UserModel.findOne({ email: dto.email })

    if (oldUser) {
      throw new BadRequestException('User with this email is already registered in the system')
    }

    const salt = await genSalt(10)

    const newUser = new this.UserModel({
      email: dto.email,
      username: dto.username,
      password: await hash(dto.password, salt),
    })

    const user = await newUser.save()

    const tokens = await this.issueTokenPair(String(newUser._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      roles: user.roles
    }
  }
}
