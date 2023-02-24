import AItemRenderer from "../../GameUtilitys/CommonUtilitys/AItemRenerer";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ListItem extends AItemRenderer<string> {
    @property(cc.Label) itemId: cc.Label = null;
    onLoad() {
    }
    protected dataChanged(): void {
        this.itemId.string = this.data;
        // console.log(`${this.data} posy: ${this.node.y}`)
    }
}
