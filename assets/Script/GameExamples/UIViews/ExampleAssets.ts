import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { UIID } from "../../GameSystems/UIConfig";
import { UIManager } from "../../GameSystems/UIManager";
import { ResLoader } from "../../GameUtilitys/ResLoader";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ExampleAssets extends BaseUIKeeperView {
    @property(cc.Label) label: cc.Label = null;
    @property(cc.Label) labelRef: cc.Label = null;
    @property text: string = 'hello';

    private item: cc.Node = null;
    private asset: cc.Asset = null;
    onLoad() {
        this.showState()
    }
    checkResRef(e: cc.Event, data: string) {
    }
    openNewWindow() {
    }
    loadItem() {
    }
    delItem() {
    }
    showState() {
        console.log(`当前bundles :`, cc.assetManager.bundles)
        console.log(`当前缓存的资源 :`, cc.assetManager.assets)
        cc.assetManager.removeBundle(cc.assetManager.getBundle("TestBundle"))
        //注意，删除bundle不会删除bundle的资源
        console.log(`删除TestBundle后bundles :`, cc.assetManager.bundles)
        // cc.assetManager.resources.loadDir("Prefabs/UIViews", cc.Prefab, (err: Error, assets: cc.Prefab[]) => {
        //     if (!err) {
        //         console.log("loaddir 包括子文件夹内的资源:", assets)
        //     }
        // })

        //加载远程或者磁盘里的资源, 只能加载图片声音文本等原生资源(可以打包成bundle)
        // cc.assetManager.loadRemote()

    }
    // update (dt) {}
    onDestroy(): void {
        super.onDestroy()//总要强制性调用surper，有没有更好的方法
    }
}
