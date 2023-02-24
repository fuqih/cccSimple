
const { ccclass, property } = cc._decorator;
@ccclass
export default class ListItem extends cc.Component {
    @property(cc.Label) itemId: cc.Label = null;
    onLoad() {
    }
    init(id: number) {
        this.itemId.string = `${id}`
    }
}
