import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Order {
  @Prop()
  userId!: string;

  @Prop()
  items!: any[];

  @Prop()
  total!: number;

  @Prop({ default: "pending" })
  status!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);