import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

export enum Roles {
  Administrator = 'Admininistrator',
  Manager = 'Manager',
  Author = 'Author',
  Viewer = 'Viewer',
}

@Schema()
export class Users {
  @Prop({
    required: true,
    unique: true,
  })
  userName: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    required: true,
  })
  role: Roles;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
