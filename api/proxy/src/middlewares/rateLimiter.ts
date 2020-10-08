import rateLimit, { Store, RateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

type RateLimiterOptions = Partial<{
  store: Store;
  max: number;
  windowMs: number;
}>;

export function rateLimiter(opts: RateLimiterOptions = {}, prefix = 'rl'): RateLimit {
  return rateLimit({
    store: new RedisStore({
      prefix,
      redisURL: process.env.APP_REDIS_URL,
    }),
    windowMs: 5 * 60000,
    max: 100,
    handler(req, res) {
      res.status(429).json({
        error: {
          code: 429,
          message: 'Too many requests',
          ...req.rateLimit,
        },
      });
    },
    ...opts,
  });
}

// shortcut for authentication routes
export function loginRateLimiter(opts: RateLimiterOptions = {}): RateLimit {
  return rateLimiter(
    {
      windowMs: 60000,
      max: 5,
      ...opts,
    },
    'rl-login',
  );
}

export function authRateLimiter(opts: RateLimiterOptions = {}): RateLimit {
  return rateLimiter(
    {
      windowMs: 60000,
      max: 100,
      ...opts,
    },
    'rl-auth',
  );
}

// shortcut for api routes
export function apiRateLimiter(opts: RateLimiterOptions = {}): RateLimit {
  return rateLimiter(
    {
      windowMs: 5 * 60000,
      max: 5 * 200,
      ...opts,
    },
    'rl-api',
  );
}