import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module"; // ✅ ADD THIS
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
      }),
    }),

    ProductsModule,
    UsersModule,
    CartModule, // ✅ ADD THIS
  ],
})
export class AppModule {}