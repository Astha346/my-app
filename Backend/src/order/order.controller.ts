import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create")
  create(@Body() body: any) {
    return this.orderService.create(body);
  }

  @Get(":userId")
  findAll(@Param("userId") userId: string) {
    return this.orderService.findAll(userId);
  }
}