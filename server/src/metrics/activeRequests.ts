import client from "prom-client";

export const activeRequests = new client.Gauge({
   name: "active_http_requests",
   help: "Counts the number of active requests",
})
