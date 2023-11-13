import * as redis from "redis";
import { RateLimitCache } from "./Types";

/**
 * Redis cache adaptor for the rate limit
 */
export class RedisRateLimitCache implements RateLimitCache {
    private client: redis.RedisClientType;

    /**
     * 
     * @param host Redis Host
     * @param port Redis Port
     * @param password Redis Password
     * @param database Database index to use
     */
    constructor(host: string, port: number, password: string, database: number) {
        this.client = redis.createClient({
            socket: {
                host,
                port
            },
            password,
            database,
        });
    }

    /**
     * Connect To Redis DB
     */
    async connect() {
        this.client.connect();
    }

    /**
     * 
     * @param id Client Identifier
     * @param cost Cost of the request
     * @returns Total tokens in the bucket
     */
    async tokenCount(id: string, cost: number): Promise<number> {
        return await this.client.INCRBY(id, cost);
    }

    /**
     * Clears the token bucket for every user
     */
    async clear() {
        await this.client.FLUSHDB();
    }
}