import client from "prom-client";

export const responseTimeHistogram = new client.Histogram({
   name: "respnse_time_histogram",
   help: "Records time taken to respond",
   labelNames: ["method", "route", "statusCode"],
   buckets: [0.1, 1, 2, 3, 5, 10, 20, 30, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000]
})
