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
        cc.assetManager.loadBundle("TestBundle")
        this.getArchitecture().GetSystem(UIManager).open(UIID.ExampleJump)
    }
    start() {
        
        //检查图集内存占用
        // let assets = cc.assetManager.assets
        // let sum: number = 0;
        // assets.forEach(as => {
        //     let mem = 0;
        //     if (as["_native"] == ".png") {
        //         mem = as["width"] * as["height"] * 4 / 1024 / 1024
        //         console.log(`asset url : ${as["url"]},size: ${mem} MB`)
        //     } else if (as["_native"] == ".jpg") {
        //         mem = as["width"] * as["height"] * 3 / 1024 / 1024
        //         console.log(`asset url : ${as["url"]},size: ${mem} MB`)
        //     }
        //     sum += mem;
        // })
        // console.log(`sum mem is :${sum} MB`)
    }
    onDestroy(): void {
    }
}
