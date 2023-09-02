import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Transform((params) => params.obj._id.toString())
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  createdAt: Date;

  updatedAt: Date;

  _doc: { [x: string]: any };
}

export const UserSchema = SchemaFactory.createForClass(User);
