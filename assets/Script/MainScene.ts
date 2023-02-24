import { IController, IArchitecture } from "./FrameworkDesign/FrameworkBase";
import { SimpleGame } from "./GameApp";
import { UIID } from "./GameSystems/UIConfig";
import { UIManager } from "./GameSystems/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainScene extends cc.Component implements IController {
    getArchitecture(): IArchitecture {
        return SimpleGame.Instance(SimpleGame);;
    }
    onLoad() {
        cc.dynamicAtlasManager.enabled = false
        this.getArchitecture().GetSystem(UIManager).open(UIID.ExampleJump)
    }
    start() {
    }
    onDestroy(): void {
    }
}
