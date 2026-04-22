import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.schema";

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(data: any) {
    return this.orderModel.create(data);
  }

  findAll(userId: string) {
    return this.orderModel.find({ userId });
  }
}