import { NestApplication } from '@nestjs/core';
import { getApp } from './test-setup';

export default async function teardown() {
    const app: NestApplication = getApp();
    if (app) {
        await app.close();
    }
}