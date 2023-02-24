// type ProgressCallback = (finished: number, total: number, item: any) => void;
// type CompleteCallback<T = any> = (err: Error | null, data: T) => void;

// // 资源加载的处理回调
// export type ProcessCallback = (completedCount: number, totalCount: number, item: any) => void;
// // 资源加载的完成回调
// export type CompletedCallback = (error: Error, resource: any | any[], urls?: string[]) => void;


// interface ILoadResArgs<T extends cc.Asset> {
//     bundle?: string;
//     dir?: string;
//     paths: string | string[];
//     type: T | null;
//     onProgress: ProcessCallback | null;
//     onComplete: CompletedCallback | null;
// }

// // load方法的参数结构
// export interface LoadArgs {
//     bundle?: string;
//     url?: string | string[];
//     type?: typeof cc.Asset;
//     onCompleted?: CompletedCallback;
//     onProgess?: ProcessCallback;
// }

// // release方法的参数结构
// export interface ReleaseArgs {
//     bundle?: string;
//     url?: string | string[] | cc.Asset | cc.Asset[],
//     type?: typeof cc.Asset,
// }

// // 兼容性处理
// let isChildClassOf = cc.js["isChildClassOf"]
// if (!isChildClassOf) {
//     isChildClassOf = cc["isChildClassOf"];
// }

// export default class ResLoader {
//     /**
//          * 加载一个资源
//          * @param bundleName    包名
//          * @param paths         资源路径
//          * @param type          资源类型
//          * @param onProgress    加载进度回调
//          * @param onComplete    加载完成回调
//          * @example
//     oops.res.load("spine_path", sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
    
//     });
//          */
//     load<T extends cc.Asset>(bundleName: string, paths: string | string[], type: T | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(bundleName: string, paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(bundleName: string, paths: string | string[], type: T | null, onComplete?: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(paths: string | string[], type: T | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(paths: string | string[], type: T | null, onComplete?: CompleteCallback<T> | null): void;
//     load<T extends cc.Asset>(
//         bundleName: string,
//         paths?: string | string[] | T | ProgressCallback | CompleteCallback | null,
//         type?: T | ProgressCallback | CompleteCallback | null,
//         onProgress?: ProgressCallback | CompleteCallback | null,
//         onComplete?: CompleteCallback | null,
//     ) {
//         let args: ILoadResArgs<T> | null = null;
//         if (typeof paths === "string" || paths instanceof Array) {
//             args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
//             args.bundle = bundleName;
//         }
//         else {
//             args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
//         }
//         this.loadByArgs(args);
//     }
// }

// export let resLoader = ResLoader;