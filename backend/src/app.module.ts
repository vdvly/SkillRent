import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { RequestsModule } from './requests/requests.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ActivityModule } from './activity/activity.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    RequestsModule,
    MessagesModule,
    ReviewsModule,
    SearchModule,
    RecommendationsModule,
    ActivityModule,
    PaymentsModule,
  ],
})
export class AppModule {}
