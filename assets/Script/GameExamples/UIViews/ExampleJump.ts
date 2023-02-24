import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { UIID } from "../../GameSystems/UIConfig";
import { UIManager } from "../../GameSystems/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ExampleJump extends BaseUIKeeperView {
    openWnd(eName: string, data: any) {
        this.getArchitecture().GetSystem(UIManager).open(UIID.ExampleList)
    }
}
