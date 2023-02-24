import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { ScoreModel } from "../../GameModels/ScoreModel";
import EventName from "../../GameSystems/EventName";
import { EventSystem } from "../../GameSystems/EventSystem";
import { UIID } from "../../GameSystems/UIConfig";
import { UIManager } from "../../GameSystems/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UIExample extends BaseUIKeeperView {
    @property(cc.Label) label: cc.Label = null;
    @property(cc.Node) nd: cc.Node = null;
    @property text: string = 'hello';
    private gamemodel: ScoreModel;
    onLoad() {
        this.gamemodel = this.getArchitecture().GetModel(ScoreModel)

        this.gamemodel.Score.onValueChange.reg(this.countChange, this)
        this.gamemodel.Score.onValueChange.trigger()
        this.getArchitecture().GetSystem(EventSystem).addEventListener(EventName.GameStart, this.GameStartEvent, this)
    }
    GameStartEvent(eName: string, data: any) {
        console.log(eName, '事件接收:', data)
    }
    start() {
    }
    countChange() {
        this.label.string = this.gamemodel.Score.Value.toString()
    }
    fntest() {
    }
    clickAddHandler(e: cc.Event, data: string) {
        // this.getArchitecture().SendCommand(new AddCountCommand())
        this.getArchitecture().GetSystem(UIManager).open(UIID.Example2)
    }
    clickSubHandler(e: cc.Event, data: string) {
        // this.getArchitecture().SendCommand(new SubCountCommand())
        this.getArchitecture().GetSystem(EventSystem).triggerEvent(EventName.GameStart, '随便什么')
    }
    // update (dt) {}
    onDestroy(): void {
        super.onDestroy()
        this.gamemodel.Score.onValueChange.unReg(this.countChange, this)
        this.getArchitecture().GetSystem(EventSystem).removeEventListener(EventName.GameStart, this.GameStartEvent, this)
    }
}
