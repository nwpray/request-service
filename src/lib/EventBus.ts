export type EventCallback = (...args:any[])=>void;
export type EventCallbackList = {[event:string]:EventCallback[]};

export default class EventBus{
    private _events:EventCallbackList = {};

    on(event:string, callback:EventCallback):EventBus{
        if(typeof this._events[event] === 'undefined')
            this._events[event] = [];

        this._events[event] = [...this._events[event], callback];

        return this;
    }
    off(event:string, callback:EventCallback):EventBus{
        if(typeof this._events[event] !== 'undefined'){
            this._events[event] = this._events[event].reduce((events, current) => {
                return current === callback ? events : [...events, current];
            }, []);
        }
        return this;
    }

    protected _trigger(event:string, ...args:any[]):EventBus{
        if(typeof this._events[event] !== 'undefined'){
            this._events[event].forEach((callback) => {
                setTimeout(() => callback(...args));
            });
        }
        return this;
    }
}