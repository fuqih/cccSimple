import { SimpleGameCommand } from "./SimpleGameCommand";
import { ScoreModel } from "../GameModels/ScoreModel";
import { EventSystem } from "../GameSystems/EventSystem";
import EventName from "../GameSystems/EventName";

export class AddCountCommand extends SimpleGameCommand {
    excute() {
        this.getArchitecture().GetModel(ScoreModel).Score.Value++
    }
}
export class SubCountCommand extends SimpleGameCommand {
    excute() {
        this.getArchitecture().GetModel(ScoreModel).Score.Value--
    }
}

export class GameStartCommand extends SimpleGameCommand {
    excute() {
        this.getArchitecture().GetSystem(EventSystem).triggerEvent(EventName.GameStart)
    }
}

export class GamePassCommand extends SimpleGameCommand {
    excute() {
        this.getArchitecture().GetSystem(EventSystem).triggerEvent(EventName.GamePass)
    }
}