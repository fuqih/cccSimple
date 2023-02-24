import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { UIManager } from "../../GameSystems/UIManager";
import { ResLoader } from "../../GameUtilitys/ResLoader";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UIExampleResLoad2 extends BaseUIKeeperView {
    @property(cc.Label) label: cc.Label = null;
    @property(cc.Label) labelRef: cc.Label = null;
    @property text: string = 'hello';

    private item: cc.Node = null;
    private asset: cc.Asset = null;
    checkResRef(e: cc.Event, data: string) {
        this.getArchitecture().GetUtility(ResLoader).dump()
        this.label.string = `总数:${cc.assetManager.assets.count}`
    }
    openNewWindow() {
        // this.getArchitecture().GetSystem(UIManager).open(UIID.ExampleResLoad2)
    }
    loadItem() {
        if (!this.item) {
            this.load('Prefabs/CommonItems/CocosHead', cc.Prefab, (err: Error, assets: cc.Prefab) => {
                this.asset = assets
                // this.asset.addRef()
                this.item = cc.instantiate(assets)
                this.item.parent = this.node
            })
        }
    }
    delItem() {
        // if (this.item) {
        //     this.item.removeFromParent()
        //     this.item = null
        // }
        if (this.asset) {
            // cc.assetManager.releaseAsset(this.asset)
            // this.asset = null;
            this.asset.decRef()
            // cc.resources.release()
            this.asset = null
        }
        cc.assetManager.removeBundle
    }
    closeWnd() {
        this.getArchitecture().GetSystem(UIManager).close(this)
    }
    // update (dt) {}
    onDestroy(): void {
        super.onDestroy()//总要强制性调用surper，有没有更好的方法
    }
    releaseAssets() {
        super.releaseAssets()
    }
}
