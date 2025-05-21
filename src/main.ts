import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { BigIntInterceptor } from './common/interceptors/BigInt'
import { RemoveUndefinedPipe } from './common/pipes/RemoveUndefined'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удалит лишние поля
      forbidNonWhitelisted: true, // выбросит ошибку при лишних полях
      transform: true, // преобразует plain объекты в DTO-классы
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The Test API description')
    .setVersion('1.0')
    .addTag('Test')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  app.enableCors()
  app.useGlobalInterceptors(new BigIntInterceptor())
  app.useGlobalPipes(new RemoveUndefinedPipe())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
