import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  productId!: number;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  image!: string;

  @Prop({ default: 1 })
  quantity!: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);