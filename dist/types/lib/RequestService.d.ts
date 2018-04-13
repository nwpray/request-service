import * as Promise from 'bluebird';
import Request, { RequestOptions, RequestAction } from './Request';
import EventBus from './EventBus';
export declare type RequestServiceState = {
    [key: string]: any;
};
export declare type RequestList = {
    [requestName: string]: Request;
};
export declare type ServiceList = {
    [serviceName: string]: RequestService;
};
export default class RequestService extends EventBus {
    private static _services;
    private _name;
    private _requests;
    private _state;
    private constructor();
    static Service(name: string): RequestService;
    protected state(state?: {
        [key: string]: any;
    }): RequestServiceState;
    getState(): RequestServiceState;
    Request(name: string, action: RequestAction, options?: RequestOptions): RequestService;
    UnbindRequest(name: string): RequestService;
    Call(name: string, ...args: any[]): Promise;
    Get(url: string, data?: {
        [key: string]: string;
    }): Promise;
    Post(url: string, data?: any): Promise;
}
