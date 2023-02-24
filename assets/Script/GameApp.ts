import { Architecture } from "./FrameworkDesign/FrameworkBase";
import { ScoreModel } from "./GameModels/ScoreModel";
import ArchievementSystem from "./GameSystems/ArchievementSystem";
import { EventSystem } from "./GameSystems/EventSystem";
import { NetManager } from "./GameSystems/NetManager";
import { UICF } from "./GameSystems/UIConfig";
import { UIManager } from "./GameSystems/UIManager";
import { SimpleGameStorage } from "./GameUtilitys/GameUtility";
import { ResLoader } from "./GameUtilitys/ResLoader";

export class SimpleGame extends Architecture<SimpleGame> {
    protected init(): void {
        /**
         * 不需要状态,故可以优先注册
         */
        this.RegisterUtility(new SimpleGameStorage())
        this.RegisterUtility(new ResLoader())
        // this.Register(new SimpleGameStorage2())//可以方便地替换

        /**
         * 相对底层的有状态的模块
         */
        this.RegisterModel(new ScoreModel())//需要状态，更底层的数据

        /**
         * 相比model更上层的模块,放在model后注册
         */
        this.RegisterSystem(new NetManager())
        this.RegisterSystem(new EventSystem())
        this.RegisterSystem(new ArchievementSystem())
        this.RegisterSystem(new UIManager())
        this.GetSystem(UIManager).replaceUIConf(UICF)
    }
}