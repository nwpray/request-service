import * as moment from 'moment';
import * as Promise from 'bluebird';

export type RequestAction = (state, ...args)=>void;

export interface RequestOptions{
    cacheLife?:[number,string]
}

export default class Request{

    private _id:string;
    private _action:RequestAction;
    private _options:RequestOptions;

    private _requests:{[key:string]:RequestSpawn} = {};

    constructor(id:string, action:RequestAction, options:RequestOptions = {}){
        this._id = id;
        this._action = action;
        this._options = options;
    }

    Call(state, ...args):Promise{
        const requestKey = JSON.stringify(args);

        if(typeof this._requests[requestKey] === "undefined")
            this._requests[requestKey] = new RequestSpawn(this._id, this._action, this._options);

        return this._requests[requestKey].Call(state, ...args);
    }
    GetId():string{
        return this._id;
    }
}

export class RequestSpawn{

    private static idInc = 0;

    private _id:string;
    private _action:RequestAction;
    private _options:RequestOptions;
    private _pending:boolean = false;
    private _lastRequest:any = null;
    private _lastRequestTime:moment.Moment = null;
    private _lastResolve:any = null;
    private _promises:{resolve, reject}[] = [];

    constructor(id:string, action:RequestAction, options:RequestOptions = {}){
        this._id = `${id}_${++RequestSpawn.idInc}`;
        this._action = action;
        this._options = options;
    }

    private _isFresh(){
        return !this._lastRequest && !this._lastResolve && !this._pending;
    }
    private _isPending(){
        return this._pending;
    }
    private _isValidCache(){
        if(!this._options.cacheLife) return false;
        return !!this._lastResolve && !!this._lastRequestTime;
    };
    private _isStale(){
        if(!this._isValidCache()) return false;
        return this._lastRequestTime.clone().add(...this._options.cacheLife).isBefore(moment());
    };
    private _resolve(data){
        this._pending = false;
        while(this._promises.length > 0)
            this._promises.shift().resolve(data);
    };
    private _reject(data){
        this._pending = false;
        while(this._promises.length > 0)
            this._promises.shift().reject(data);
    }

    private _cacheStatus(){
        let status:any = {};

        if(this._isPending())
            status.pending = 'orange';
        if(this._isValidCache())
            status.valid = 'green';
        if(this._isStale())
            status.stale = 'red';
        if(this._isFresh())
            status.fresh = 'blue';

        return status;
    }
    private _logStatus(){
        const status = this._cacheStatus();
        const statusCodes = Object.keys(status);
        const colors = statusCodes.map((code) => `color:${status[code]}`);

        console.log(`${this._id} cache status: %c${statusCodes.join(', %c')}`, ...colors);
    }

    Call(state, ...args):Promise{
        return new Promise((resolve, reject) => {

            this._promises = [...this._promises, { resolve, reject }];

            const status:any = this._cacheStatus();
            this._logStatus();

            if(status.valid && !status.stale)
                return this._resolve(this._lastResolve);

            if(status.pending)
                return;

            resolve = (data) => {
                this._lastResolve = data;
                this._resolve(data);
            };
            reject = (data) => {
                this._lastResolve = null;
                this._reject(data);
            };

            this._pending = true;
            this._lastRequestTime = moment();
            this._lastRequest = args;

            this._action({ resolve, reject }, state, ...args);

        });
    }
}