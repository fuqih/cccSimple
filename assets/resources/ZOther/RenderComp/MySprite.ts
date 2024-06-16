import MyAssembler from "./MyAssembler";

const { ccclass, property, mixins, executeInEditMode } = cc._decorator;

@ccclass
@mixins(cc.BlendFunc)
@executeInEditMode
export default class MySprite extends cc.RenderComponent {

    @property(cc.Texture2D)
    _texture: cc.Texture2D = null;
    @property(cc.Integer)
    _eadgeCount: number = 6;
    @property(cc.Integer)
    public get eadgeCount() {
        return this._eadgeCount;
    }
    public set eadgeCount(value: number) {
        this._eadgeCount = value;
        this.calculatePoints();
        this.setVertsDirty();
    }

    _assembler: cc.Assembler = null;
    public spriteFrame: cc.SpriteFrame = null;
    public points: cc.Vec2[] = [];
    @property(cc.Texture2D)
    public get texture() {
        return this._texture;
    }
    public set texture(tex: cc.Texture2D) {
        this._texture = tex;
        this.spriteFrame = new cc.SpriteFrame();
        this.spriteFrame.setTexture(tex);
        this.node.width = this._texture.width;
        this.node.height = this._texture.height;
        if (CC_EDITOR) {
            Editor.log('farme is ', this.spriteFrame);
        }
        this._updateMaterial();
    }
    @property({ type: cc.Enum(cc.macro.BlendFactor), override: true })
    srcBlendFactor: cc.macro.BlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
    @property({ type: cc.Enum(cc.macro.BlendFactor), override: true })
    dstBlendFactor: cc.macro.BlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;

    public calculatePoints() {
        const points = [];

        const r = this.node.width > this.node.height ? this.node.height / 2 : this.node.width / 2;

        const angle = Math.PI * 2 / this.eadgeCount;
        let startPoint = cc.v2(-r * Math.cos(angle), -r * Math.sin(angle));
        points.push(startPoint);
        let startp = startPoint
        for (let i = 1; i < this.eadgeCount; i++) {
            let point = startp.rotate(angle * i);
            points.push(point);
        }

        this.points = points;
    }
    // __preload会调用
    public _resetAssembler() {
        let assembler = this._assembler = new MyAssembler();
        assembler.init(this);
        this._updateColor();
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
        this['__proto__']._updateBlendFunc.call(this);
        // cc.BlendFunc.prototype._updateMaterial.call(this);
        this.setVertsDirty();
    }


    start() {
        let p1 = cc.v2(-100, 200);
        let p3 = cc.v2(300, 200);
        let p2 = cc.v2(0, 0);
        let p4 = cc.v2(300, 0);

        const isIn = this.isInTriangle(p4, p1, p2, p3);
        console.log('isIn is ', isIn);
    }
    update(dt: number) {
        // this._updateMaterial();
    }
    /**
     * 监测一个点是否在三角形内
     * @param  {cc.Vec2} point
     * @param  {cc.Vec2} a
     * @param  {cc.Vec2} b
     * @param  {cc.Vec2} c
     */
    private isInTriangle(point: cc.Vec2, a: cc.Vec2, b: cc.Vec2, c: cc.Vec2) {
        const isEqualSign = (n1, n2) => {
            return (n1 >= 0 && n2 >= 0) || (n1 <= 0 && n2 <= 0);
        }

        const ca = a.sub(c);
        const cb = b.sub(c);
        const cd = point.sub(c);

        const ac = c.sub(a);
        const ab = b.sub(a);
        const ad = point.sub(a);

        const ba = a.sub(b);
        const bc = c.sub(b);
        const bd = point.sub(b);

        const cCross = isEqualSign(ca.cross(cb), ca.cross(cd));
        const aCross = isEqualSign(ab.cross(ac), ab.cross(ad));
        const bCross = isEqualSign(bc.cross(ba), bc.cross(bd));
        return cCross && aCross && bCross;
    }
}