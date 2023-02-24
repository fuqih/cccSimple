import { BaseSystem } from "../FrameworkDesign/FrameworkBase";
import { ScoreModel } from "../GameModels/ScoreModel";

export default class ArchievementSystem extends BaseSystem {
    protected maxScore: number = 0;
    init() {
        let model = this.getArchitecture().GetModel(ScoreModel)
        this.maxScore = model.Score.Value
        model.Score.onValueChange.reg(() => {
            if (model.Score.Value > this.maxScore) {
                console.log('新的最大分数:', model.Score.Value)
                this.maxScore = model.Score.Value
            }
        }, this)
    }
}