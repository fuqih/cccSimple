import PolygonAssembler from "./PolygonAssembler";

const { ccclass, property, mixins, executeInEditMode } = cc._decorator;


const renderEngine = cc.renderer.renderEngine;

/** 这是一个自定义的多边形渲染组件
 * shader可以解决特效需求但会导致dc增加
 * 可以创建一个自定义的渲染组件，需要继承自cc.RenderComponent，并实现一个自定义的assembler
 * 需重写 updateRenaderData,updateUvs,updateVerts,updateWorldVerts,fillBuffers
 * sprite源码的simple.js文件
 */
@ccclass
// @mixins(cc.BlendFunc),使用默认的，不然要自己设置
@executeInEditMode
export default class PolygonSprite extends cc.RenderComponent {
    @property(cc.Texture2D)
    _texture: cc.Texture2D = null;
    @property(cc.Texture2D)
    get texture() {
        return this._texture;
    }
    set texture(value: cc.Texture2D) {
        this._texture = value
        let l = -value.width / 2, b = -value.height / 2, t = value.height / 2, r = value.width / 2;
        this.polygon = [cc.v2(l, b), cc.v2(r, b), cc.v2(r, t), cc.v2(l, t)];
        this._updateMaterial();

        if (CC_EDITOR) {
            Editor.log('mySprite set texture')
        }
    }
    /**多边形相关数据 */
    @property({ type: [cc.Vec2], serializable: true })
    _polygon: cc.Vec2[] = [];
    @property({ type: [cc.Vec2], serializable: true })
    public get polygon() {
        return this._polygon;
    }
    public set polygon(points: cc.Vec2[]) {
        this._polygon = points;
        this._updateVerts();
    }
    /**父类有这个属性 */
    public _assembler: cc.Assembler = null;

    private _updateVerts() {
        this.setVertsDirty();
    }
    public _updateMaterial() {
        let texture = this._texture;
        let material = this.getMaterial(0);
        if (material) {
            if (material.getDefine("USE_TEXTURE") !== undefined) {
                material.define("USE_TEXTURE", true);
            }
            material.setProperty("texture", texture);
        }
        /**
         * 提示不全，往上调用,两种方式都可以，可以看BlendFunc
         */
        // this['__proto__']._updateBlendFunc.call(this);
        // cc.BlendFunc.prototype._updateMaterial.call(this);
        this.setVertsDirty();
    }
    public _validateRender() {
    }
    /**
     * __preload调用 ??
     */
    public _resetAssembler() {
        let assembler = this._assembler = new PolygonAssembler()
        assembler.init(this);
        this._updateColor();
        this.setVertsDirty();
    }
}