import * as Promise from 'bluebird';
export declare type RequestAction = (state, ...args) => void;
export interface RequestOptions {
    cacheLife?: [number, string];
}
export default class Request {
    private _id;
    private _action;
    private _options;
    private _requests;
    constructor(id: string, action: RequestAction, options?: RequestOptions);
    Call(state: any, ...args: any[]): Promise;
    GetId(): string;
}
export declare class RequestSpawn {
    private static idInc;
    private _id;
    private _action;
    private _options;
    private _pending;
    private _lastRequest;
    private _lastRequestTime;
    private _lastResolve;
    private _promises;
    constructor(id: string, action: RequestAction, options?: RequestOptions);
    private _isFresh();
    private _isPending();
    private _isValidCache();
    private _isStale();
    private _resolve(data);
    private _reject(data);
    private _cacheStatus();
    private _logStatus();
    Call(state: any, ...args: any[]): Promise;
}
