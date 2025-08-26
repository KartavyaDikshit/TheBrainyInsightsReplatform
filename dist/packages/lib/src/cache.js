import { LRUCache } from 'lru-cache';
const options = {
    max: 500,
    ttl: 1000 * 60 * 5, // 5 minutes
};
const cache = new LRUCache(options);
export default cache;
