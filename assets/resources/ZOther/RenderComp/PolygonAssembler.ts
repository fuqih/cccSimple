import PolygonSprite from "./PolygonSprite";

const { ccclass, property } = cc._decorator;

const gfx = cc['gfx'];
// 顶点格式 -> 位置 UV, 颜色
let vfmtPosUvColor = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
]);
/**
 * 单个顶点数据[uv,pos,color]
 * 一组顶点数据
 * renderdata:包含顶点，顶点索引等其他数据
 */
/**
 * assembler的核心是顶点数据，通过改变顶点位置,uv信息也可以实现特效并不影响合批
 * 简言之就是计算顶点的pos,uv,color，和顶点索引,再赋值到buffer中，可以参考assembler-2d
 * ps:顶点发生数量变化时才更新顶点，不然计算数据就行
 * Assembler有两个静态方法用于组件和assembler的注册和初始化
 */
@ccclass
export default class PolygonAssembler extends cc.Assembler {
    //将这五个属性注入到Assembler2D.prototype中
    public floatsPerVert = 5;//一个顶点所需的空间,xy占2,uv占2,color占1,参考上面定义的vfmtPosUvColor
    public verticesCount = 4;//顶点个数
    public indicesCount = 6;//三角形顶点个数(需要多少个索引)
    public uvOffset = 2;//uv在buffer的偏移
    public colorOffset = 4;//color在buffer的偏移

    public indicesArr: number[] = [];//索引id，将顶点数据和三角形顶点关联
    public _renderData: cc.RenderData = null;
    constructor() {
        super();
        this._renderData = new cc.RenderData();
        this._renderData.init(this);

        this.initData();
    }
    /**顶点空间占用 */
    get verticesFloats() {
        return this.verticesCount * this.floatsPerVert;
    }

    public getBuffer() {
        return cc.renderer['_handle'].getBuffer('mesh', this.getVfmt());
    }
    initData() {
        let data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
    }
    public resetData(comp: PolygonSprite) {
        let points = comp.polygon;
        if (!points || points.length < 3) return;

        // 顶点个数根据points的长度
        this.verticesCount = points.length;
        // 索引个数
        this.indicesCount = this.verticesCount + (this.verticesCount - 3) * 2;
        this._renderData['clear']();
        this.initData();
    }
    /**
     * 初始化顶点索引，因为有重复顶点，所以使用索引减少数据
     * @param indices 
     * @param arr 
     */
    public initQuadIndices(indices: number[], arr: number[]) {
        for (let i = 0; i < arr.length; i++) {
            indices[i] = arr[i];
        }
    }

    /**
     * 更新顶点颜色
     * @param comp 
     * @param color 
     */
    updateColor(comp: PolygonSprite, color: number) {
        let uintVerts = this._renderData.uintVDatas[0];//注意，这和vdatas是同一段，只不过格式不一样
        if (!uintVerts) return;
        color = color != null ? color : comp.node.color['_val'];
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;

        let polygon = comp.polygon;
        for (let i = 0; i < polygon.length; i++) {
            uintVerts[colorOffset + i * floatsPerVert] = color;
        }
    }
    updateUVs(comp: PolygonSprite) {
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        let verts = this._renderData.vDatas[0];//渲染数据
        let uvs: cc.Vec2[] = [];
        if (comp.texture) {
            //这里并没有用节点尺寸，而是纹理尺寸，可以自己调
            uvs = this.computeUv(comp.polygon, comp.texture.width, comp.texture.height);
        }
        let polygon = comp.polygon;
        for (let i = 0; i < polygon.length; i++) {
            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = uvs[i]?.x;
            verts[dstOffset + 1] = uvs[i]?.y;
        }
    }
    protected updateWorldVertsWebGL(comp: PolygonSprite) {
        let verts = this._renderData.vDatas[0];

        let matrix: cc.Mat4 = comp.node['_worldMatrix'];
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];
        //tx,ty是节点相对世界坐标的偏移，abcd的Node的旋转值
        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;
        let floatsPerVert = this.floatsPerVert;
        if (justTranslate) {
            let polygon = comp.polygon;
            for (let i = 0; i < polygon.length; i++) {
                verts[i * floatsPerVert] = polygon[i].x + tx;
                verts[i * floatsPerVert + 1] = polygon[i].y + ty;
            }
        } else {
            let polygon = comp.polygon;
            for (let i = 0; i < polygon.length; i++) {
                verts[i * floatsPerVert] = a * polygon[i].x + c * polygon[i].y + tx;
                verts[i * floatsPerVert + 1] = b * polygon[i].x + d * polygon[i].y + ty;
            }
        }
    }
    protected updateWorldVertsNative(comp: PolygonSprite) {
        let verts = this._renderData.vDatas[0];
        let floatsPerVert = this.floatsPerVert;

        let polygon = comp.polygon;
        for (let i = 0; i < polygon.length; i++) {
            verts[i * floatsPerVert] = polygon[i].x;
            verts[i * floatsPerVert + 1] = polygon[i].y;
        }
    }
    protected updateWorldVerts(comp: PolygonSprite) {
        if (CC_NATIVERENDERER) {
            this.updateWorldVertsNative(comp);
        } else {
            this.updateWorldVertsWebGL(comp);
        }
    }
    /**更新顶点数据,用了索引优化，所以既更新顶点又更新顶点索引 */
    updateVerts(comp: PolygonSprite) {
        let polygon = comp.polygon
        let indicesArr = this.splitPolygon(polygon);
        this.initQuadIndices(this._renderData.iDatas[0], indicesArr);
        this.updateWorldVerts(comp);
    }
    /**
     * 更新 RenderData
     * @override
     * */
    updateRenderData(comp: PolygonSprite) {
        if (comp._vertsDirty) {
            this.resetData(comp);
            this.updateUVs(comp);
            this.updateVerts(comp);
            this.updateColor(comp, null);
            comp._vertsDirty = false;
        }
    }
    /**
     * 每帧调用,往buffer里填充数据
     * @param comp 
     * @param renderer 
     * @override
     */
    fillBuffers(comp: PolygonSprite, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderData = this._renderData;
        // vData里包含 pos， uv， color数据， iData中包含顶点索引
        let vData = renderData.vDatas[0];
        let iData = renderData.iDatas[0];

        let buffer = this.getBuffer();
        let offsetInfo = buffer.request(this.verticesCount, this.indicesCount);
        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        if (vData.length + vertexOffset > vbuf.length) {
            vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset);
        } else {
            vbuf.set(vData, vertexOffset);
        }

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    }
    /**
     * 格式信息 
     * @override
     * */
    public getVfmt() {
        return vfmtPosUvColor
    }

    /**沿用 */
    packToDynamicAtlas(comp: PolygonSprite, frame: any) {
        if (CC_TEST) return;

        if (!frame._original && cc.dynamicAtlasManager && frame._texture.packable) {
            let packedFrame = cc.dynamicAtlasManager.insertSpriteFrame(frame);
            if (packedFrame) {
                frame._setDynamicAtlasFrame(packedFrame);
            }
        }
        let material = comp['_materials'][0];
        if (!material) return;

        if (material.getProperty('texture') !== frame._texture) {
            // texture was packed to dynamic atlas, should update uvs
            comp._vertsDirty = true;
            comp._updateMaterial();
        }
    }

    // 判断一个点是否在三角形内
    private isInTriangle(point: cc.Vec2, triA: cc.Vec2, triB: cc.Vec2, triC: cc.Vec2) {
        let AB = triB.sub(triA), AC = triC.sub(triA), BC = triC.sub(triB), AD = point.sub(triA), BD = point.sub(triB);
        //@ts-ignore
        return (AB.cross(AC) >= 0 ^ AB.cross(AD) < 0) && (AB.cross(AC) >= 0 ^ AC.cross(AD) >= 0) && (BC.cross(AB) > 0 ^ BC.cross(BD) >= 0);
    }
    /**
     * 将多边形分解为多个三角形，并返回索引数组
     * @param points 
     * @returns 
     */
    private splitPolygon(points: cc.Vec2[]): number[] {
        if (points.length <= 3) return [0, 1, 2];
        let pointMap: { [key: string]: number } = {};     // point与idx的映射
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            pointMap[`${p.x}-${p.y}`] = i;
        }
        const getIdx = (p: cc.Vec2) => {
            return pointMap[`${p.x}-${p.y}`]
        }
        points = points.concat([]);
        let idxs: number[] = [];

        let index = 0;
        while (points.length > 3) {
            let p1 = points[(index) % points.length]
                , p2 = points[(index + 1) % points.length]
                , p3 = points[(index + 2) % points.length];
            let splitPoint = (index + 1) % points.length;

            let v1 = p2.sub(p1);
            let v2 = p3.sub(p2);
            if (v1.cross(v2) < 0) {      // 是一个凹角, 寻找下一个
                index = (index + 1) % points.length;
                continue;
            }
            let hasPoint = false;
            for (const p of points) {
                if (p != p1 && p != p2 && p != p3 && this.isInTriangle(p, p1, p2, p3)) {
                    hasPoint = true;
                    break;
                }
            }
            if (hasPoint) {      // 当前三角形包含其他点, 寻找下一个
                index = (index + 1) % points.length;
                continue;
            }
            // 找到了耳朵, 切掉
            idxs.push(getIdx(p1), getIdx(p2), getIdx(p3));
            points.splice(splitPoint, 1);
        }
        for (const p of points) {
            idxs.push(getIdx(p));
        }
        return idxs;
    }
    /** 计算uv, 锚点都是中心 */
    private computeUv(points: cc.Vec2[], width: number, height: number) {
        let uvs: cc.Vec2[] = [];
        for (let p of points) {
            let x = this.clamp(0, 1, (p.x + width / 2) / width);
            //texture高反取，cocos坐标是左下原点的
            let y = this.clamp(0, 1, 1 - (p.y + height / 2) / height);
            uvs.push(cc.v2(x, y));
        }
        return uvs;
    }
    //value限制在范围内
    private clamp(left: number, right: number, value: number) {
        if (left > right) {
            let t = left;
            left = right;
            right = t;
        }
        if (value < left) return left;
        if (value > right) return right;
        return value;
    }
}