

export default class ScrollOptimizer{

    private container:cc.Node = null;

    constructor(ScrollNode:cc.Node){
        this.container = ScrollNode.getComponent(cc.ScrollView).content;
        ScrollNode.on("scrolling", this._event_update_opacity, this);
        this.container.on(cc.Node.EventType.CHILD_REMOVED, this._event_update_opacity, this);
        this.container.on(cc.Node.EventType.CHILD_REORDER, this._event_update_opacity, this);
    }

    /* ***************功能函数*************** */
    /**获取在世界坐标系下的节点包围盒(不包含自身激活的子节点范围) */
    private _get_bounding_box_to_world(node_o_: any): cc.Rect {
        let w_n: number = node_o_._contentSize.width;
        let h_n: number = node_o_._contentSize.height;
        let rect_o = cc.rect(
            -node_o_._anchorPoint.x * w_n, 
            -node_o_._anchorPoint.y * h_n, 
            w_n, 
            h_n
        );
        node_o_._calculWorldMatrix();
        rect_o.transformMat4(rect_o, node_o_._worldMatrix);
        return rect_o;
    }
    /**检测碰撞 */
    private _check_collision(node_o_: cc.Node): boolean {
        let rect1_o = this._get_bounding_box_to_world(this.container.parent);
        let rect2_o = this._get_bounding_box_to_world(node_o_);
        // ------------------保险范围
        rect1_o.width += rect1_o.width * 0.5;
        rect1_o.height += rect1_o.height * 0.5;
        rect1_o.x -= rect1_o.width * 0.25;
        rect1_o.y -= rect1_o.height * 0.25;
        return rect1_o.intersects(rect2_o);
    }
    /* ***************自定义事件*************** */
    private _event_update_opacity(): void {
        this.container.children.forEach(v1_o=> {
            v1_o.opacity = this._check_collision(v1_o) ? 255 : 0;
        });
    }

}
