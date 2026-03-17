type CacheEntry<T> = {
    value: T,
    expiresAt: number | null
}

class InMemoryCache<T> {
    private store = new Map<string, CacheEntry<T>>();

    set(key: string, value: T, ttlMs?: number){
        const expiresAt = ttlMs ? Date.now() + ttlMs : null;
        this.store.set(key, {value, expiresAt})
    }

    get(key: string): T | null{
        const entry = this.store.get(key)
        if(!entry) return null; 

        if(entry.expiresAt && Date.now() > entry.expiresAt){
            this.store.delete(key);
            return null
        }
        return entry.value;
    }

    delete(key: string){
        this.store.delete(key);
    }

    clear(){
        this.store.clear();
    }
}

const globalForCache = globalThis as {
    _cache?:  InMemoryCache<any>
}

export const cache = globalForCache._cache || (globalForCache._cache = new InMemoryCache<any>())