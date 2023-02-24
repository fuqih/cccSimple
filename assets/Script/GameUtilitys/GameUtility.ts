import { BaseUtility } from "../FrameworkDesign/FrameworkBase";

export interface IStorage {
    getItem(key: any): any;
    setItem(key: any, value: any): any;
}

export abstract class BaseStorage extends BaseUtility implements IStorage {
    abstract getItem(key: any): any;
    abstract setItem(key: any, value: any): any;
}

export class SimpleGameStorage extends BaseStorage {//可以根据不同的应用存储不同的storage，应在app中实例化
    getItem(key: any) {
        return cc.sys.localStorage.getItem(`${key}1`)
    }
    setItem(key: any, value: any) {
        cc.sys.localStorage.setItem(`${key}1`, value)
    }
}
export class SimpleGameStorage2 extends BaseStorage {
    getItem(key: any) {
        return cc.sys.localStorage.getItem(`${key}2`)
    }
    setItem(key: any, value: any) {
        cc.sys.localStorage.setItem(`${key}2`, value)
    }
}