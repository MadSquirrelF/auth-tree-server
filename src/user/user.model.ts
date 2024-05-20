/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface UserModel extends Base { }

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  username: string

  @prop()
  password: string

  @prop({ default: ['USER']})
  roles: string[]
}