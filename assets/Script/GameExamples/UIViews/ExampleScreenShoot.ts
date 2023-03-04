import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { ScoreModel } from "../../GameModels/ScoreModel";
import EventName from "../../GameSystems/EventName";
import { EventSystem } from "../../GameSystems/EventSystem";
import { UIID } from "../../GameSystems/UIConfig";
import { UIManager } from "../../GameSystems/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ExampleScreenShoot extends BaseUIKeeperView {
    @property(cc.Sprite) screenShoot: cc.Sprite = null;
    @property(cc.Camera) camera: cc.Camera = null;
    @property(cc.Label) text: cc.Label = null;
    private cameraTarget: cc.RenderTexture = null;
    onLoad() {
        let count = 1;
        this.schedule(() => {
            this.text.string = `当前:${count++}`
        }, 1, cc.macro.REPEAT_FOREVER)
    }
    GameStartEvent(eName: string, data: any) {
        console.log(eName, '事件接收:', data)
    }
    start() {

        // this.cameraTarget = new cc.RenderTexture()
        // let sp = new cc.SpriteFrame()
        // sp.setTexture(this.cameraTarget)
        // let tex = new cc.Texture2D()

        // this.camera.targetTexture = this.cameraTarget
        let cm = cc.Camera.cameras[0]
        cm.targetTexture = this.cameraTarget
        console.log(cm.targetTexture)
        // this.screenShoot.spriteFrame.getTexture()
    }
    onScreenShoot() {
        let cm = cc.Camera.cameras[0]
        console.log(cm.targetTexture)
        let data = this.cameraTarget.readPixels()
        let wd = this.cameraTarget.width
        let hg = this.cameraTarget.height
        // let tex = new cc.Texture2D()
        // tex.initWithData(data, cc.Texture2D.PixelFormat.RGBA8888, wd, hg)
        // let sp = new cc.SpriteFrame()
        // sp.setTexture(tex)
        // this.screenShoot.spriteFrame = sp;
    }
    // update (dt) {}
    onDestroy(): void {
        super.onDestroy()
    }
}
