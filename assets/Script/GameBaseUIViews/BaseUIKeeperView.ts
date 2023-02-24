import { AssetType, CompleteCallback, ProgressCallback, ResLoader } from "../GameUtilitys/ResLoader";
import { BaseUIView } from "./BaseUIView";



const { ccclass, property } = cc._decorator;
@ccclass
export class BaseUIKeeperView extends BaseUIView {
    private resCache = new Set<cc.Asset>();

    /**
         * 加载一个资源
         * @param bundleName    远程包名
         * @param paths         资源路径
         * @param type          资源类型
         * @param onProgress    加载进度回调
         * @param onComplete    加载完成回调
         * @example
    oops.res.load("spine_path", sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
    
    });
         */
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(paths: string | string[], onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(paths: string | string[], type: AssetType<T> | null, onComplete: CompleteCallback<T>): void;
    load<T extends cc.Asset>(
        bundleName: string,
        paths?: string | string[] | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback,
    ) {
        // 最后一个参数是加载完成回调,必须有这个回调
        if (arguments.length < 2 || typeof arguments[arguments.length - 1] != "function") {
            console.error(`load faile, completed callback not found`);
            return;
        }
        // 包装完成回调，添加自动缓存功能
        let finishCallback = arguments[arguments.length - 1];
        let cb: CompleteCallback<T> = (error, resource) => {
            if (!error) {
                if (resource instanceof Array) {
                    resource.forEach(element => {
                        this.cacheAsset(element);
                    });
                } else {
                    this.cacheAsset(resource);
                }
            }
            finishCallback(error, resource);
        }
        arguments[arguments.length - 1] = cb
        //调用加载接口
        let ld = this.getArchitecture().GetUtility(ResLoader)
        ld.load.apply(ld, arguments)
    }
    /**
     * 缓存资源
     * @param asset 
     */
    public cacheAsset(asset: cc.Asset) {
        if (!this.resCache.has(asset)) {
            asset.addRef();
            this.resCache.add(asset);
        }
    }
    /**
     * 组件销毁时自动释放所有keep的资源
     */
    public onDestroy() {
        this.releaseAssets();
    }
    /**
     * 释放资源，组件销毁时自动调用
     */
    public releaseAssets() {
        this.resCache.forEach(element => {
            element.decRef();
        });
        this.resCache.clear();
    }
}