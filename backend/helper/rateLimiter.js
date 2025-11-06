import rateLimit from "express-rate-limit";
import { LRUCache } from "lru-cache";

export const ipLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const userRateCache = new LRUCache({
  max: 5000,         
  ttl: 60 * 60 * 1000,
});

export const userLimiter = (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Admin ID is required." });

  const attempts = userRateCache.get(id) || 0;

  if (attempts >= 5) {
    return res.status(429).json({
      error: "Too many password change attempts for this user. Try again later.",
    });
  }

  userRateCache.set(id, attempts + 1);

  next();
};

export const resetUserAttempts = (id) => {
  userRateCache.delete(id);
};
