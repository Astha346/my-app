import { Controller, Get, Post, Body } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create")
  create(@Body() body: any) {
    console.log("CONTROLLER HIT");

    return this.orderService.create({
      ...body,
      userId: "test-user",
    });
  }

  @Get()
  findAll() {
    return this.orderService.findAll("test-user");
  }
}