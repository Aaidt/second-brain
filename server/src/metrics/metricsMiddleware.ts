import { Request, Response, NextFunction } from "express";
import { reqCount } from "./requestCount";
import { activeRequests } from "./activeRequests";
import { responseTimeHistogram } from "./responseTimeHistogram";


export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
   const startTime = Date.now();
   activeRequests.inc();

   req.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Request took: ${duration}ms.`)

      reqCount.inc({
         method: req.method,
         route: req.originalUrl,
         statusCode: res.statusCode
      })

      activeRequests.dec()

      responseTimeHistogram.observe({
         method: req.method,
         route: req.originalUrl,
         statusCode: res.statusCode
      }, duration)
   })

   next();

}
