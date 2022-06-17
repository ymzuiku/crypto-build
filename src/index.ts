import fastify from "fastify";
import { dog } from "./dog";

const app = fastify();

app.get("/v1/hello", async () => {
  dog();
  return { msg: "world" };
});

console.log("__debug__", "aaaa33222a22aa");

console.log("Server listen: http://localhost:5000");
dog();
app.listen({ port: 5000 });
