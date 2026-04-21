import { Controller, Get, Post, Body, Delete, Param } from "@nestjs/common";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("add")
  add(@Body() body: any) {
    return this.cartService.addToCart(body);
  }

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cartService.removeFromCart(Number(id));
  }

  @Delete()
  clear() {
    return this.cartService.clearCart();
  }
}