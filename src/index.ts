import fastify from "fastify";
import { module } from "./module";

const app = fastify();

app.get("/v1/hello", async () => {
  module();
  return { msg: "world" };
});

console.log("Server listen: http://localhost:5000");

app.listen({ port: 5000 });
