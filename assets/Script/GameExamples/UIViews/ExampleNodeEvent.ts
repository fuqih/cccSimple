import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { UIManager } from "../../GameSystems/UIManager";

const { ccclass, property } = cc._decorator;


@ccclass
export default class ExampleNodeEvent extends BaseUIKeeperView {
    @property(cc.Label) private tipLabel: cc.Label = null;
    @property(cc.Node) private eventNode: cc.Node = null;
    @property(cc.Button) private clsBtn: cc.Button = null;
    @property(cc.Sprite) private sp: cc.Sprite = null;
    @property(cc.Texture2D) private tex: cc.Texture2D = null;
    onLoad() {
        this.eventNode.on(cc.Node.EventType.TOUCH_START, this.TOUCH_START, this)
        this.eventNode.on(cc.Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this)
        this.eventNode.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this)
        this.eventNode.on(cc.Node.EventType.TOUCH_CANCEL, this.TOUCH_CANCEL, this)
        // this.schedule(() => {
        //     console.log("xxyy")
        // }, 1, 10000)
        let b = new cc.Texture2D()
        let a = new cc.RenderTexture()
    }
    TOUCH_START(event: cc.Event.EventTouch) {
        console.log('TOUCH_START', event)
    }
    TOUCH_MOVE(event: cc.Event.EventTouch) {
        console.log('TOUCH_MOVE', event)
    }
    TOUCH_END(event: cc.Event.EventTouch) {
        console.log('TOUCH_END', event)
    }
    TOUCH_CANCEL(event: cc.Event.EventTouch) {
        console.log('TOUCH_CANCEL', event)
    }
    start(): void {

    }
    protected update(dt: number): void {
        // console.log("xx")
    }
    protected lateUpdate(dt: number): void {
        // console.log("xx")
    }
    public onOpen(fromUI: number, ...args: any): void {

    }
    clickHandler() {
        console.log(this.sp.spriteFrame.getTexture())
    }
    onCloseBtnClick(event: cc.Event, data: string) {
        this.getArchitecture().GetSystem(UIManager).close(this)
    }
}
