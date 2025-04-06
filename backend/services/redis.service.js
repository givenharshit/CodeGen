import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("REDIS CONNECTED!!");
});

redisClient.on("error", (error) => {
  console.log("REDIS ERROR $$ : ", error);
});

export default redisClient;
// import this in the file where you want to use the Redis client