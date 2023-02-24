import { BaseModel } from "../FrameworkDesign/FrameworkBase";
import { BindablePropery } from "../GameUtilitys/CommonUtilitys/CommonUtility";
import { IStorage, SimpleGameStorage } from "../GameUtilitys/GameUtility";

export class ScoreModel extends BaseModel {
    public Score: BindablePropery<number>;
    init() {
        let storage: IStorage = this.getArchitecture().GetUtility(SimpleGameStorage)//这里能看出不用接口获取有多不方便
        let modelData: number = storage.getItem('Score') || 0;
        this.Score = new BindablePropery<number>(modelData)
        this.Score.onValueChange.reg(() => {//思考一下怎么注销这个回调
            storage.setItem('Score', this.Score.Value)
        }, this)
    }
    getData() {
    }
}