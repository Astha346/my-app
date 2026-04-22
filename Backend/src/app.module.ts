import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartModule } from "./cart/cart.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/myapp"),
    CartModule,
    OrderModule, // ✅ ADD THIS
  ],
})
export class AppModule {}