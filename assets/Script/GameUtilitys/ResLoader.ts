
// 资源加载的处理回调
export type ProgressCallback = (finished: number, total: number, item: any) => void;
// 资源加载的完成回调
export type CompleteCallback<T = any> = (err: Error | null, data: T | T[]) => void;
export type AssetType<T = cc.Asset> = Constructor<T>;

type IRemoteOptions = any;
type Constructor<T = unknown> = new (...args: any[]) => T;

interface ILoadResArgs<T extends cc.Asset> {
    bundle?: string;
    dir?: string;
    paths: string | string[];
    type: AssetType<T> | null;
    onProgress: ProgressCallback | null;
    onComplete: CompleteCallback<T> | null;
}

/** 游戏资管理 */
export class ResLoader {
    /**
     * 加载远程资源
     * @param url           资源地址
     * @param options       资源参数，例：{ ext: ".png" }
     * @param onComplete    加载完成回调
     * @example
    var opt: IRemoteOptions = { ext: ".png" };
    var onComplete = (err: Error | null, data: ImageAsset) => {
        const texture = new Texture2D();
        texture.image = data;
        
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        
        var sprite = this.sprite.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
    }
    loadRemote<ImageAsset>(this.url, opt, onComplete);
     */
    loadRemote<T extends cc.Asset>(url: string, options: IRemoteOptions | null, onComplete?: CompleteCallback<T> | null): void;
    loadRemote<T extends cc.Asset>(url: string, onComplete?: CompleteCallback<T> | null): void;
    loadRemote<T extends cc.Asset>(url: string, ...args: any): void {
        var options: IRemoteOptions | null = null;
        var onComplete: CompleteCallback<T> | null = null;
        if (args.length == 2) {
            options = args[0];
            onComplete = args[1];
        }
        else {
            onComplete = args[0];
        }
        cc.assetManager.loadRemote<T>(url, options, onComplete);
    }

    /**
     * 加载资源包
     * @param url       资源地址
     * @param complete  完成事件
     * @param v         资源MD5版本号
     * @example
        var serverUrl = "http://192.168.1.8:8080/";         // 服务器地址
        var md5 = "8e5c0";                                  // Cocos Creator 构建后的MD5字符
        await loadBundle(serverUrl,md5);
     */
    loadBundle(url: string, v?: string) {
        return new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            cc.assetManager.loadBundle(url, { version: v }, (err, bundle: cc.AssetManager.Bundle) => {
                if (err) {
                    return cc.error(err);
                }
                resolve(bundle);
            });
        });
    }

    /**
     * 加载一个资源
     * @param bundleName    远程包名
     * @param paths         资源路径
     * @param type          资源类型
     * @param onProgress    加载进度回调
     * @param onComplete    加载完成回调
     * @example
        load("spine_path", sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
        });
     */
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    load<T extends cc.Asset>(
        bundleName: string,
        paths?: string | string[] | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
        }
        else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
        }
        this.loadByArgs(args);
    }

    /**
     * 加载文件夹中的资源
     * @param bundleName    远程包名
     * @param dir           文件夹名
     * @param type          资源类型
     * @param onProgress    加载进度回调
     * @param onComplete    加载完成回调
     * @example
        // 加载进度事件
        var onProgressCallback = (finished: number, total: number, item: any) => {
            console.log("资源加载进度", finished, total);
        }

        // 加载完成事件
        var onCompleteCallback = () => {
            console.log("资源加载完成");
        }
        loadDir("game", onProgressCallback, onCompleteCallback);
     */
    loadDir<T extends cc.Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(bundleName: string, dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(bundleName: string, dir: string, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(dir: string, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends cc.Asset>(
        bundleName: string,
        dir?: string | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
        }
        else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
        }
        args.dir = args.paths as string;
        this.loadByArgs(args);
    }
    public release(asset: cc.Asset): void;
    public release(asset: cc.Asset[]): void;
    release(asset: cc.Asset | cc.Asset[]) {
        if (asset instanceof cc.Asset) {
            cc.assetManager.releaseAsset(asset)
        } else if (asset instanceof Array) {
            asset.forEach(as => cc.assetManager.releaseAsset(as))
        }
    }
    /**
     * 通过相对文件夹路径删除所有文件夹中资源
     * @param path          资源文件夹路径
     * @param bundleName    远程资源包名
     */
    releaseDir(path: string, bundleName: string = "resources") {
        var bundle: cc.AssetManager.Bundle | null = cc.assetManager.getBundle(bundleName);
        var infos = bundle?.getDirWithPath(path);
        infos?.map((info) => {
            this.releasePrefabtDepsRecursively(info.uuid);
        });

        if (path == "" && bundleName != "resources" && bundle) {
            cc.assetManager.removeBundle(bundle);
        }
    }

    /**
     * 获取资源
     * @param path          资源路径
     * @param type          资源类型
     * @param bundleName    远程资源包名
     */
    get<T extends cc.Asset>(path: string, type?: Constructor<T> | null, bundleName: string = "resources"): T | null {
        var bundle: cc.AssetManager.Bundle | null = cc.assetManager.getBundle(bundleName);
        return bundle!.get(path, type);
    }

    /** 打印缓存中所有资源信息 */
    dump() {
        cc.assetManager.assets.forEach((value: cc.Asset, key: string) => {
            console.log(cc.assetManager.assets.get(key));
        })
        console.log(`当前资源总数:${cc.assetManager.assets.count}`);
    }

    private parseLoadResArgs<T extends cc.Asset>(
        paths: string | string[],
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onComplete?: ProgressCallback | CompleteCallback | null
    ) {
        let pathsOut: any = paths;
        let typeOut: any = type;
        let onProgressOut: any = onProgress;
        let onCompleteOut: any = onComplete;
        if (onComplete === undefined) {
            const isValidType = cc.js.isChildClassOf(type as AssetType, cc.Asset);
            if (onProgress) {
                onCompleteOut = onProgress as CompleteCallback;
                if (isValidType) {
                    onProgressOut = null;
                }
            }
            else if (onProgress === undefined && !isValidType) {
                onCompleteOut = type as CompleteCallback;
                onProgressOut = null;
                typeOut = null;
            }
            if (onProgress !== undefined && !isValidType) {
                onProgressOut = type as ProgressCallback;
                typeOut = null;
            }
        }
        return { paths: pathsOut, type: typeOut, onProgress: onProgressOut, onComplete: onCompleteOut };
    }

    private loadByBundleAndArgs<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, args: ILoadResArgs<T>): void {
        if (args.dir) {
            bundle.loadDir(args.paths as string, args.type, args.onProgress, args.onComplete);
        }
        else {
            if (typeof args.paths == 'string') {
                bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            }
            else {
                bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            }
        }
    }

    private loadByArgs<T extends cc.Asset>(args: ILoadResArgs<T>) {
        if (args.bundle) {
            if (cc.assetManager.bundles.has(args.bundle)) {
                let bundle = cc.assetManager.bundles.get(args.bundle);
                this.loadByBundleAndArgs(bundle!, args);
            }
            else {
                // 自动加载bundle
                cc.assetManager.loadBundle(args.bundle, (err, bundle) => {
                    if (!err) {
                        this.loadByBundleAndArgs(bundle, args);
                    }
                })
            }
        }
        else {
            this.loadByBundleAndArgs(cc.resources, args);
        }
    }

    /** 释放预制依赖资源 */
    private releasePrefabtDepsRecursively(uuid: string) {
        var asset = cc.assetManager.assets.get(uuid)!;
        cc.assetManager.releaseAsset(asset);

        if (asset instanceof cc.Prefab) {
            var uuids: string[] = cc.assetManager.dependUtil.getDepsRecursively(uuid)!;
            uuids.forEach(uuid => {
                var asset = cc.assetManager.assets.get(uuid)!;
                asset.decRef();
            });
        }
    }
}