import { beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/ipag_test_db";
  process.env.RABBITMQ_URL = "amqp://docker:docker@localhost:5672";
});

afterAll(async () => {});

beforeEach(async () => {});

afterEach(async () => {});
