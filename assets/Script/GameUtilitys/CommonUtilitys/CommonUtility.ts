export class EventMap {
    protected _map = new Map<Function, Set<any>>();
    reg(listener: Function, caller: any) {
        const set = this._map.get(listener);
        if (set == null) {
            this._map.set(listener, new Set([caller]));
        } else {
            set.add(caller);
        }
    }
    unReg(listener: Function, caller: any) {
        const set = this._map.get(listener);
        if (set == null) {
            return;
        } else {
            set.delete(caller);
            if (set.size == 0) {
                this._map.delete(listener);
            }
        }
    }
    isEmpty() {
        return this._map.size == 0;
    }
    trigger(data?: any) {
        this._map.forEach((set, f) => {
            set.forEach(caller => {
                if (caller) {
                    f.apply(caller, [data]);
                }
            })
        })
    }
    triggerWithEventName(eventName: string, data?: any) {
        this._map.forEach((set, f) => {
            set.forEach(caller => {
                if (caller) {
                    f.apply(caller, [eventName, data]);
                }
            })
        })
    }
}
export class BindablePropery<T>{
    public onValueChange: EventMap = new EventMap()
    private mValue: T;
    constructor(dtf?: T) {
        this.mValue = dtf;
    }
    public get Value() {
        return this.mValue;
    };
    public set Value(v: T) {
        if (this.mValue !== v) {//需要考虑复杂数据类型，暂时不实现
            this.mValue = v;
            this.onValueChange.trigger()
        }
    };
}