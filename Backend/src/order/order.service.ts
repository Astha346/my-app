import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) {}

  async create(data: any) {
    console.log("SERVICE HIT");
    console.log("DATA:", data);

    const result = await this.orderModel.create(data);

    console.log("SAVED ORDER:", result);

    return result;
  }

  findAll(userId: string) {
    return this.orderModel.find({ userId });
  }
}