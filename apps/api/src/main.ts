import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3001)
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:5173')

  // ─── Security ──────────────────────────────────────────────────────────────
  app.use(helmet())
  app.use(cookieParser())

  // ─── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // ─── Global prefix ─────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1')

  // ─── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // ─── Swagger ───────────────────────────────────────────────────────────────
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Zelya API')
      .setDescription('API de la plateforme adulte Zelya')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api/docs', app, document)
  }

  await app.listen(port)
  console.log(`🚀 Zelya API running on http://localhost:${port}/api/v1`)
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()
