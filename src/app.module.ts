import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuditModule } from './audit/audit.module';
import { NotificationModule } from './notification/notification.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ProjectModule } from './project/project.module';
import { SiteModule } from './site/site.module';
import { JobModule } from './job/job.module';
import { MaterialModule } from './material/material.module';
import { MaterialTransactionModule } from './material-transaction/material-transaction.module';
import { JointModule } from './joint/joint.module';
import { SpoolModule } from './spool/spool.module';
import { DrawingConnectionModule } from './drawing-connection/drawing-connection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,  // 60 seconds default TTL
      max: 100,    // maximum number of items in cache
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,   // 1 minute window
      limit: 100,   // 100 requests per minute
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        extra: {
          max: 20, // Increased connection pool for concurrent users
        },
        synchronize: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    // Core modules
    AuthModule,
    UserModule,
    AuditModule,
    NotificationModule,
    // Business modules
    ProjectModule,
    SiteModule,
    JobModule,
    MaterialModule,
    MaterialTransactionModule,
    JointModule,
    SpoolModule,
    DrawingConnectionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT authentication guard - all routes require auth by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global roles guard - checks @Roles() decorator
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
