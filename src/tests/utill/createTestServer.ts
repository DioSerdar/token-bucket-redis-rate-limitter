import "./configureEnv";
import { RateLimit } from "../../lib/RateLimit";
import { RedisRateLimitCache } from "../../lib/RedisRateLimitCache";
import express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";

export const createTestServer = async () => {
    let app = express();
    //Generate the cache for public endpoints
    let publicCache = new RedisRateLimitCache(
        process.env.REDIS_URL as string,
        parseInt(process.env.REDIS_PORT as string),
        process.env.REDIS_PASS as string,
        parseInt(process.env.CACHE_DB_INDEX_PUBLIC as string)
    );
    await publicCache.connect();
    await publicCache.clear();

    //Rate limitter for public endpoints
    let publicRateLimit = new RateLimit(
        {
            tokenBucketSize: parseInt(process.env.TOKEN_BUCKET_SIZE_PUBLIC as string),
            clearInterval: parseInt(process.env.TOKEN_RENEW_INTERVAL_PUBLIC as string),
            cache: publicCache,
            clientIdentifier: async (req: Request) => {
                return req.ip as string;
            }
        }
    );

    //Genearate the cache for private endpoints
    let privateCache = new RedisRateLimitCache(
        process.env.REDIS_URL as string,
        parseInt(process.env.REDIS_PORT as string),
        process.env.REDIS_PASS as string,
        parseInt(process.env.CACHE_DB_INDEX_PRIVATE as string)
    );
    await privateCache.connect();
    await privateCache.clear();

    //Rate limitter for private endpoints
    let privateRateLimit = new RateLimit(
        {
            tokenBucketSize: parseInt(process.env.TOKEN_BUCKET_SIZE_PRIVATE as string),
            clearInterval: parseInt(process.env.TOKEN_RENEW_INTERVAL_PRIVATE as string),
            cache: publicCache,
            clientIdentifier: async (req: Request) => {
                return req.headers.authorization as string;
            }
        }
    );

    //Generate dummy users for private endpoints
    let users: Record<string, boolean> = {};
    for (let i = 0; i < 5; i++)
        users[v4()] = true;

    //Authentication Middleware
    let requireAuth = (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization === undefined)
            return res.status(401).send({
                "error": "No Auth",
                "description": "New Phone, who dis?"
            });
        if (users[req.headers.authorization] !== true)
            return res.status(401).send({
                "error": "No Auth Match",
                "description": "I shoudn't talk to strangers"
            });
        next();
    }

    //Only public endpoint
    app.get("/public", publicRateLimit.limit(1), (req, res) => {
        return res.send("Access granted!");
    })

    //Private endpoints with diffirent token costs 
    app.get("/private/1", requireAuth, privateRateLimit.limit(1), (req, res) => {
        return res.send("Access granted!");
    })

    app.get("/private/2", requireAuth, privateRateLimit.limit(2), (req, res) => {
        return res.send("Access granted!");
    })

    app.get("/private/5", requireAuth, privateRateLimit.limit(5), (req, res) => {
        return res.send("Access granted!");
    })

    //We need app aswell as the auth tokens for the tests
    return { users: Object.keys(users), app };
}