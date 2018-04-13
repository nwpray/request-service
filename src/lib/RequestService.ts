import * as Promise from 'bluebird';
import axios from 'axios';

import Request, { RequestOptions, RequestAction } from './Request';

import EventBus from './EventBus';

export type RequestServiceState = {[key:string]:any};
export type RequestList = {[requestName:string]:Request};
export type ServiceList = {[serviceName:string]:RequestService};

export default class RequestService extends EventBus{
    private static _services:ServiceList = {};

    private _name:string;
    private _requests:RequestList = {};
    private _state:RequestServiceState = {};

    private constructor(serviceName:string){
        super();
        this._name = serviceName;
    }

    static Service(name:string):RequestService{
        if(typeof RequestService._services[name] === 'undefined'){
            RequestService._services[name] = new RequestService(name);
        }

        return RequestService._services[name];
    }

    protected state(state:{[key:string]:any} = undefined):RequestServiceState{
        if(typeof state !== 'undefined'){
            this._trigger('on.state.change', state);
            this._state = {...this._state, ...state};
            this._trigger('on.state.changed', state);
        }

        return this.getState();
    }
    getState():RequestServiceState{
        return {...this._state};
    }

    Request(name:string, action:RequestAction, options:RequestOptions = {}):RequestService{
        this._trigger('on.request.bind', name);
        this._requests[name] = new Request(name, action, options);
        this._trigger('on.request.bound', name);
        return this;
    }
    UnbindRequest(name:string):RequestService{
        this._trigger('on.request.unbind', name);
        delete this._requests[name];
        this._trigger('on.request.unbound', name);
        return this;
    }

    Call(name:string, ...args:any[]):Promise{
        this._trigger('on.call', name, ...args);
        return new Promise((resolve, reject) => {
            if(typeof this._requests[name] === 'undefined'){
                const message = `In service ${this._name}, the request ${name} does not exist.`;
                this._trigger('on.call.rejected', name, args, message);
                this._trigger('on.call.reject', name, args, message);
                reject(message);
                this._trigger('on.call.rejected', name, args, message);
                this._trigger(`on.${name}.rejected`, name, args, message);
                return;
            }

            this._requests[name].Call((...args) => this.state(...args), ...args)
                .then((response) => {
                    this._trigger(`on.${name}.resolve`, name, args, response);
                    this._trigger('on.call.resolve', name, args, response);
                    resolve(response);
                    this._trigger('on.call.resolved', name, args, response);
                    this._trigger(`on.${name}.resolved`, name, args, response);
                })
                .catch((error) => {
                    this._trigger(`on.${name}.reject`, name, args, error);
                    this._trigger('on.call.reject', name, args, error);
                    reject(error);
                    this._trigger('on.call.rejected', name, args, error);
                    this._trigger(`on.${name}.rejected`, name, args, error);
                });
        });
    }

    Get(url:string, data:{[key:string]:string} = {}):Promise{
        this._trigger('on.get', url, data);

        return new Promise((resolve, reject) => {

            let params = Object.keys(data).reduce((params, current) => {
                return [...params, `${current}=${data[current]}`];
            }, [])
                .join('&');

            axios.get(`${url}${params ? `?${params}` : ''}`)
                .then((response) => {
                    this._trigger('on.get.resolve', name, data, response);
                    resolve(response)
                    this._trigger('on.get.resolved', name, data, response);
                })
                .catch((error) => {
                    this._trigger('on.get.reject', name, data, error);
                    reject(error)
                    this._trigger('on.get.rejected', name, data, error);
                });

        });
    }
    Post(url:string, data:any = null):Promise{
        this._trigger('on.post', url, data);
        return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then((response) => {
                    this._trigger('on.post.resolve', url, data, response);
                    resolve(response);
                    this._trigger('on.post.resolved', url, data, response);
                })
                .catch((error) => {
                    this._trigger('on.post.reject', url, data, error);
                    reject(error);
                    this._trigger('on.post.rejected', url, data, error);
                })
        });
    }
}