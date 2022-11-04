
import { json } from "stream/consumers";
import redis from "./redis"

const fetch = async <T> (key: string, fetcher: () => T, expires: number) => {
    const existing = await get<T>(key);
    if (existing != null) 
        return existing;
    return set(key, fetcher, expires); //Else add a key, value.

};

const set = async <T>(key: string, fetcher: () => T, expires: number) => {

    const value = await fetcher();

    console.log(value);
    
    await redis.redis.set(key, JSON.stringify(value), "EX", expires);
    return value;
};


const get = async <T> (key: string): Promise <T> => {
    const value = await redis.redis.get(key);
    if(value === null) 
        return null;
    return JSON.parse(value);
};

const del = async (key: string) => {
    await redis.redis.del(key);
};

export default {fetch, set, get, del};