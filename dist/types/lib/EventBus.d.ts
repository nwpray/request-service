export declare type EventCallback = (...args: any[]) => void;
export declare type EventCallbackList = {
    [event: string]: EventCallback[];
};
export default class EventBus {
    private _events;
    on(event: string, callback: EventCallback): EventBus;
    off(event: string, callback: EventCallback): EventBus;
    protected _trigger(event: string, ...args: any[]): EventBus;
}
