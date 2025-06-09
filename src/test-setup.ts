import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

let app: NestApplication;

export async function setup() {
    const module = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    return app;
}

export function getApp() {
    return app;
}