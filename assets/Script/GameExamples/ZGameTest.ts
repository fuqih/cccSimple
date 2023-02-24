export class ClassA {
    private info: string;
    constructor(info?: string) {
        this.info = info
    }
    connect() {
        console.log('A 连接成功', this.info)
    }
}
export class ClassB {
    private info: string;
    constructor(info?: string) {
        this.info = info
    }
    disConnect() {
        console.log('B 断连成功', this.info)
    }
}

class Singleton<T extends Singleton<T>> {
    private static instance: any = null;
    public static Instance<T>(c: { new(): T }): T {
        if (this.instance === null) {
            this.instance = new c();
        }
        return this.instance
    }
}

class Animal<T> extends Singleton<T>{
    public root: string = "Animal";
}

class Beast extends Animal<Beast>{
    constructor() {
        super()
        this.root = "Beast"
    }
}
class Bird extends Animal<Beast>{
    constructor() {
        super()
        this.root = "Bird"
    }
}

let bird = Bird.Instance<Bird>(Bird);
let beast = Beast.Instance(Beast);

namespace Singleton2 {
    class Singleton {
        static getInstance<T extends {}>(this: new () => T): T {
            if (!(<any>this).instance) {
                (<any>this).instance = new this();
            }
            return (<any>this).instance;
        }
    }

    class Bar extends Singleton {
        desc: string;
        public print() {
        }
    }

    Bar.getInstance().desc = "single";
    Bar.getInstance().print();
    Bar.getInstance().print();
    let b = Bar.getInstance()
}
