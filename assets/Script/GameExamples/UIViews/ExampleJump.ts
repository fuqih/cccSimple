import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { UIID } from "../../GameSystems/UIConfig";
import { UIManager } from "../../GameSystems/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ExampleJump extends BaseUIKeeperView {
    openWnd(eName: string, data: any) {
        // this.getArchitecture().GetSystem(UIManager).open(UIID.ExampleNodeEvent);
        let nd = cc.find("Canvas/TestNode")
        nd.x += 10;
        nd.y -= 10;
        nd.color.r++;
        nd.color.g++;
        nd.color.b++;
        nd.color.a++;
    }
}
