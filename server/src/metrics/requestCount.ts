import client from "prom-client";

export const reqCount = new client.Counter({
   name: "count_http_request",
   help: "Counts the number of http requests",
   labelNames: ["method", "route", "statusCode"]
})
