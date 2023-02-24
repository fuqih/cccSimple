import { BaseSystem } from "../FrameworkDesign/FrameworkBase";
import { EventMap } from "../GameUtilitys/CommonUtilitys/CommonUtility";
export type EventCallFunc = (eventName: string, eventData: any) => void;
interface CallBackTarget {
    callBack: EventCallFunc,
    target: any,
}
export class EventSystem extends BaseSystem {
    init() {
    }
    private _eventListeners: { [key: string]: CallBackTarget[] } = {};

    private getEventListenersIndex(eventName: string, callBack: EventCallFunc, target?: any): number {
        let index = -1;
        for (let i = 0; i < this._eventListeners[eventName].length; i++) {
            let iterator = this._eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    }

    addEventListener(eventName: string, callBack: EventCallFunc, target?: any): boolean {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }

        if (null == callBack) {
            cc.log('addEventListener callBack is nil');
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        if (null == this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [callTarget];

        } else {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 == index) {
                this._eventListeners[eventName].push(callTarget);
            }
        }

        return true;
    }

    setEventListener(eventName: string, callBack: EventCallFunc, target?: any): boolean {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }

        if (null == callBack) {
            cc.log('setEventListener callBack is nil');
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        this._eventListeners[eventName] = [callTarget];
        return true;
    }

    removeEventListener(eventName: string, callBack: EventCallFunc, target?: any) {
        if (null != this._eventListeners[eventName]) {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 != index) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }
    }

    triggerEvent(eventName: string, eventData?: any) {
        // console.log(`==================== raiseEvent ${eventName} begin | ${JSON.stringify(eventData)}`);
        if (null != this._eventListeners[eventName]) {
            // 将所有回调提取出来，再调用，避免调用回调的时候操作了事件的删除
            let callbackList: CallBackTarget[] = [];
            for (const iterator of this._eventListeners[eventName]) {
                callbackList.push({ callBack: iterator.callBack, target: iterator.target });
            }
            for (const iterator of callbackList) {
                iterator.callBack.call(iterator.target, eventName, eventData);
            }
        }
        // console.log(`==================== raiseEvent ${eventName} end`);
    }
}
/**
 * 细拆，与1不同的是考虑是否将参数转换为数组及是否将事件名传入
 */
class EventSystem2 extends BaseSystem {
    private _eventListeners: { [eventName: string]: EventMap } = {};
    init() {
    }
    addEventListener(eventName: string, callBack: EventCallFunc, target?: any): boolean {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }

        if (null == callBack) {
            cc.log('addEventListener callBack is nil');
            return false;
        }
        if (!this._eventListeners[eventName]) {
            this._eventListeners[eventName] = new EventMap();
        }
        this._eventListeners[eventName].reg(callBack, target);

        return true;
    }
    removeEventListener(eventName: string, callBack: EventCallFunc, target?: any) {
        if (!this._eventListeners[eventName]) {
            return;
        }
        this._eventListeners[eventName].unReg(callBack, target);
        if (this._eventListeners[eventName].isEmpty()) {
            delete this._eventListeners[eventName];
        }
    }
    triggerEvent(eventName: string, eventData?: any) {
        console.log(`==================== raiseEvent ${eventName} begin | ${JSON.stringify(eventData)}`);
        if (this._eventListeners[eventName]) {
            this._eventListeners[eventName].triggerWithEventName(eventName, eventData)
        }
        console.log(`==================== raiseEvent ${eventName} end`);
    }
}