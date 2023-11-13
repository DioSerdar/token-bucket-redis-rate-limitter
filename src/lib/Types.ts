import { Request } from "express";

/**
 * Ratelimit Cache contract
 */
export interface RateLimitCache {
    tokenCount: (id: string, cost: number) => Promise<number>,
    clear: () => Promise<void>,
}


/**
 * Constructor options for rate limitter
 */
export type RateLimitOptions = {
    cache: RateLimitCache,
    clientIdentifier: (request: Request) => Promise<string>,
    tokenBucketSize: number,
    clearInterval: number,
}