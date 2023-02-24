export class Singleton<T extends Singleton<T>> {
    private static instance: any = null;
    public static Instance<T>(c: { new(): T }): T {
        if (this.instance === null) {
            this.instance = new c();
        }
        return this.instance
    }
}

/**
 * 没有做到以接口获取类的功能（可以获取后自行使用接口进行转换）
 * 且同一个容器中不可以有相同的类。(因为是用类名做唯一标识)
 */
export class IOCContainer {
    private mInstances: Map<string, any> = new Map<string, any>()
    Register<T extends {}>(instance: T) {
        let name = instance.constructor.name
        if (!this.mInstances.has(name)) {
            this.mInstances.set(name, instance)
        } else {
            let old: T = this.mInstances.get(name)
            console.log('容器中的实例已被替换', old.constructor.name)
            this.mInstances.set(name, instance)
        }
    }
    Get<T extends {}>(type: { new(): T }): T {
        let name = type.name
        if (this.mInstances.has(name)) {
            return this.mInstances.get(name)
        } else {
            return null;
        }
    }
}
export interface IArchitecture {
    // MakeSureInit(): void;
    // Get<T extends {}>(type: { new(): T }): T; 使用更细致的模块分类
    // Register<T extends {}>(instance: T): any;
    RegisterModel<T extends IBaseModel>(instance: T): any;
    GetModel<T extends {}>(type: { new(): T }): T;
    RegisterUtility<T extends IBaseUtility>(instance: T): any;
    GetUtility<T extends {}>(type: { new(): T }): T;
    RegisterSystem<T extends IBaseSystem>(instance: T): any;
    GetSystem<T extends {}>(type: { new(): T }): T;
    SendCommand<T extends ICommand>(command: T): void;//可以考虑优化成传不传对象传类也可以
}
export abstract class Architecture<T extends Architecture<T>> extends Singleton<T> implements IArchitecture {
    private mInit = false;
    private modelInitList: IBaseModel[] = [];
    private systemInitList: IBaseSystem[] = [];
    private mContainer: IOCContainer = new IOCContainer();
    constructor() {//可以根据情况初始化注册相关逻辑
        super()
        if (!this.mInit) {//model比system更底层，初始化system可能访问model
            this.init()
            this.modelInitList.forEach(baseModel => baseModel.init())
            this.modelInitList.length = 0;
            this.systemInitList.forEach(baseSystem => baseSystem.init())
            this.systemInitList.length = 0;
            this.mInit = true;
        }
    }
    protected abstract init(): void;//提供给子类的初始化方法
    RegisterSystem<T extends IBaseSystem>(instance: T) {
        instance.setArchitecture(this);//注册之前把自己设置到模块中
        this.mContainer.Register(instance)
        if (!this.mInit) {//一般在初始化中就注册完所有模块，但动态注册的话需要执行初始化
            this.systemInitList.push(instance);
        } else {
            instance.init()
        }
    }
    GetSystem<T extends {}>(type: new () => T): T {
        return this.mContainer.Get(type)
    }
    RegisterModel<T extends IBaseModel>(instance: T) {
        instance.setArchitecture(this);//注册之前把自己设置到模块中
        this.mContainer.Register(instance)
        if (!this.mInit) {//一般在初始化中就注册完所有模块，但动态注册的话需要执行初始化
            this.modelInitList.push(instance);
        } else {
            instance.init()
        }
    }
    GetModel<T extends {}>(type: { new(): T }): T {
        return this.mContainer.Get(type)
    }
    RegisterUtility<T extends IBaseUtility>(instance: T) {//工具类不需要初始化操作
        this.mContainer.Register(instance)
    }
    GetUtility<T extends {}>(type: { new(): T }): T {
        return this.mContainer.Get(type)
    }
    SendCommand<T extends ICommand>(command: T) {
        command.setArchitecture(this)
        command.excute()
        command.setArchitecture(null)
    }
}
export interface IBelongToArchitecture {
    getArchitecture(): IArchitecture;
}
export interface ICanSetArchitecture {
    setArchitecture(v: IArchitecture): void;
}
export interface IBaseModel extends IBelongToArchitecture, ICanSetArchitecture {//增加一个生命周期方法，用于架构的model的init。
    init(): any;
}
export abstract class BaseModel implements IBaseModel {
    protected m_Architecture: IArchitecture;
    getArchitecture(): IArchitecture {
        return this.m_Architecture;
    }
    setArchitecture(v: IArchitecture) {
        this.m_Architecture = v;
    }
    abstract init(): any;
}
export interface IBaseSystem extends IBelongToArchitecture, ICanSetArchitecture {//有状态，所以需要初始化方法
    init(): any;
}
export abstract class BaseSystem implements IBaseSystem {
    protected m_Architecture: IArchitecture;
    getArchitecture(): IArchitecture {
        return this.m_Architecture;
    }
    setArchitecture(v: IArchitecture) {
        this.m_Architecture = v;
    }
    abstract init(): any;
}
export interface IBaseUtility {//有状态，所以需要初始化方法
}
export class BaseUtility implements IBaseUtility {//无状态，什么也不需要，方便标识
}
/**
 * 表现层会经常创建销毁，且和引擎表现耦合，所以不会注册到架构里
 * 说明自己属于架构，方便使用this而不是单例来获取应用架构
 * contorl应当只需要读取架构.但没合适的语法
 */
export interface IController extends IBelongToArchitecture {
}
/**
 * ts不支持多继承，
 * 因此需要考虑自己继承cc.comp，然后手动约定所有的业务代码继承都继承此comp以增加功能
 */
export abstract class Controller implements IController {
    private m_Architecture: IArchitecture;
    getArchitecture(): IArchitecture {
        if (!this.m_Architecture) {
            // this.m_Architecture = SimpleGame.Instance(SimpleGame);
        }
        return this.m_Architecture;
    }
}
export interface ICommand extends IBelongToArchitecture, ICanSetArchitecture {
    excute(): any;
}
/**
 * command应当由表现层往底层系统层发送，因语法支持问题，例如model层获取架构的时候也是可以发送command，这是不恰的
 */
export abstract class BaseCommand implements ICommand {
    private m_Architecture: IArchitecture;
    /**
     * 一般应当由架构执行
     */
    abstract excute(): any;
    getArchitecture(): IArchitecture {
        return this.m_Architecture
    };
    /**
     * 应当由架构调用设置,不如C#那样可以用接口声明的实现方法把这个函数隐藏，这点不够好
     * @param v 
     */
    setArchitecture(v: IArchitecture): void {
        this.m_Architecture = v;
    }
}