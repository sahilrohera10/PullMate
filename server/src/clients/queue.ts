const { Queue, Worker } = require("bullmq");
const redisConnection = require("./redis-connection");

export const payloadProcessingQueue = new Queue("payload-processing", {
  connection: redisConnection,
});
