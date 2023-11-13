import { RateLimitOptions } from "./Types";
import { Request, Response, NextFunction } from 'express';
import schedule from "node-schedule";

/**
 *  Rate limitter for express
 */
export class RateLimit {
    private options: RateLimitOptions;
    private scheduledClearEvent: number;

    /**
     * 
     * @param options Rate limit options
     */
    constructor(options: RateLimitOptions) {
        this.options = options;
        this.scheduledClearEvent = Date.now();
        this.clearCache();
    }

    /**
     * resets api consumption rates
     */
    private clearCache = () => {
        this.options.cache.clear();
        this.scheduledClearEvent = this.options.clearInterval + Date.now();
        schedule.scheduleJob(new Date(this.scheduledClearEvent), this.clearCache);
    }

    /**
     * Generates a rate limit middleware
     * @param cost tokens to be consumed by each request
     * @returns rate limit middleware
     */
    limit = (cost: number) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const id = await this.options.clientIdentifier(req);
            const tokenCount = await this.options.cache.tokenCount(id, cost);
            res.setHeader("Remaining-Tokens", Math.max(this.options.tokenBucketSize - tokenCount, 0));
            res.setHeader("X-RateLimit-Reset", new Date(this.scheduledClearEvent).toString());
            res.setHeader("Client-Id", id);
            if (tokenCount > this.options.tokenBucketSize) {
                res.setHeader("Retry-After",
                    ((this.scheduledClearEvent - Date.now()) / 1000)
                        .toFixed(0)
                        .toString());

                return res.status(429).send({
                    "error": "Slow down cowboy!",
                    "description": `You can make another request after ${new Date(this.scheduledClearEvent)}`
                });
            }
            next();
        }
    }
}