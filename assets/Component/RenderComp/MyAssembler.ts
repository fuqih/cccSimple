import MySprite from "./MySprite";

const { ccclass, property } = cc._decorator;

const gfx = cc['gfx'];

// 顶点格式 -> 位置 UV, 颜色
let vfmtPosUvColor = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
]);

@ccclass
export default class MyAssembler extends cc.Assembler {

    public floatsPerVert = 5;//顶点数据大小
    public verticesCount = 4;//顶点数
    public indicesCount = 6;//索引数
    public uvOffset = 2;//数据偏移值
    public colorOffset = 4;//数据偏移值

    public _renderData: cc.RenderData = null;
    constructor() {
        super();
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
        this.initData();
    }

    get verticesFloats() {
        return this.verticesCount * this.floatsPerVert;
    }
    /**
     * 初始化顶点数据容器
     */
    initData() {
        let data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
    }
    /**
     * 更新顶点数
     * 顶点数发生变化时重新初始化容器
     * @param comp 
     * @returns 
     */
    public resetData(comp: MySprite) {
        let points = this.calculatePoints(comp);
        if (!points || points.length < 3) return;
        // 顶点个数根据points的长度
        this.verticesCount = points.length;
        // 索引个数
        this.indicesCount = this.verticesCount + (this.verticesCount - 3) * 2;
        this._renderData['clear']();
        this.initData();
    }
    private initQuadIndices(indices: number[], arr: number[]) {
        for (let i = 0; i < arr.length; i++) {
            indices[i] = arr[i];
        }
    }
    updateVerts(comp: MySprite) {
        const points = this.calculatePoints(comp);
        const indicesArr = this.getIndicesByPoints(points);
        console.log('indicesArr is ', indicesArr);
        this.initQuadIndices(this._renderData.iDatas[0], indicesArr);
        this.updateWorldVerts(comp);
    }
    updateUVs(comp: MySprite) {
        const points = this.calculatePoints(comp);
        const uvs = this.computeUv(points, comp.node.width, comp.node.height);

        // const uv = [
        //     0,1,
        //     1,1,
        //     0,0,
        //     1,0,
        // ];
        // 更新uv数据
        console.log('uvs is ', uvs);
        const verts = this._renderData.vDatas[0];
        for (let i = 0; i < uvs.length; i++) {
            let dstOffset = this.floatsPerVert * i + this.uvOffset;

            verts[dstOffset] = uvs[i].x;
            verts[dstOffset + 1] = uvs[i].y;
        }
    }
    updateColor(comp: MySprite, color: number) {
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color != null ? color : comp.node.color['_val'];
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    }

    updateWorldVerts(comp: MySprite) {
        let verts = this._renderData.vDatas[0];

        let matrix: cc.Mat4 = comp.node['_worldMatrix'];
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let floatsPerVert = this.floatsPerVert;
        let vertexOffset = 0;
        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        const points = this.calculatePoints(comp);
        console.log('points is ', points);

        if (justTranslate) {
            for (let i = 0; i < points.length; i++) {
                verts[i * floatsPerVert] = points[i].x + tx;
                verts[i * floatsPerVert + 1] = points[i].y + ty;
            }
        } else {
            for (let i = 0; i < points.length; i++) {
                verts[i * floatsPerVert] = a * points[i].x + c * points[i].y + tx;
                verts[i * floatsPerVert + 1] = b * points[i].x + d * points[i].y + ty;
            }
        }
    }
    /**
     * 全部更新
     * @override
     * @param comp 
     */
    updateRenderData(comp: MySprite) {
        if (comp._vertsDirty) {
            this.resetData(comp);
            this.updateUVs(comp);
            this.updateVerts(comp);
            this.updateColor(comp, null);
            comp._vertsDirty = false;
        }
    }
    getBuffer() {
        return cc.renderer['_handle'].getBuffer('mesh', vfmtPosUvColor);
    }
    fillBuffers(comp: MySprite, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }
        let renderData = this._renderData;
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
     * @override
     * @param comp 
     * @param frame 
     * @returns 
     */
    packToDynamicAtlas(comp: MySprite, frame: any) {
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
    /**
     * 根据多边形要几个边计算各个点的位置
     * @param comp 
     * @returns 
     */
    private calculatePoints(comp: MySprite) {
        const points: cc.Vec2[] = [];
        const r = comp.node.width > comp.node.height ? comp.node.height / 2 : comp.node.width / 2;
        const angle = Math.PI * 2 / comp.eadgeCount;
        let startPoint = cc.v2(-r * Math.cos(angle), -r * Math.sin(angle));
        let startp = startPoint;
        points.push(startp);
        for (let i = 1; i < comp.eadgeCount; i++) {
            let point = startp.rotate(angle);
            points.push(point);
            startp = point;
        }
        console.log('points is ', points);
        // this.points = points;
        return points;
    }
    private getIndicesByPoints(points: cc.Vec2[]) {
        if (points.length === 3) return [0, 1, 2];

        let pointIndexMap: { [key: string]: number } = {};

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            pointIndexMap[`${p.x.toFixed(2)}-${p.y.toFixed(2)}`] = i;
        }

        let index = 0;

        let indexs = [];

        points = points.concat([]);

        while (points.length > 3) {
            // 点的长度大于3继续分割
            let p1 = points[index % points.length];
            let p2 = points[(index + 1) % points.length];
            let p3 = points[(index + 2) % points.length];

            let p21 = p1.sub(p2);
            let p23 = p3.sub(p2);
            // 分割点
            let splitPoint = p2;
            if (p23.cross(p21) < 0) {
                // p2点是凹点
                index = (index + 1) % points.length;
                continue;
            }

            let isIn = false;
            for (let p of points) {
                if (p !== p1 && p !== p2 && p !== p3 && this.isInTriangle(p, p1, p2, p3)) {
                    isIn = true;
                    break;
                }
            }
            if (isIn) {
                index = (index + 1) % points.length;
                continue;
            }

            const splitPointIndex = (index + 1) % points.length;
            // 切耳
            points.splice(splitPointIndex, 1);

            indexs.push(pointIndexMap[`${p1.x.toFixed(2)}-${p1.y.toFixed(2)}`]);
            indexs.push(pointIndexMap[`${p2.x.toFixed(2)}-${p2.y.toFixed(2)}`]);
            indexs.push(pointIndexMap[`${p3.x.toFixed(2)}-${p3.y.toFixed(2)}`]);

        }

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            indexs.push(pointIndexMap[`${p.x.toFixed(2)}-${p.y.toFixed(2)}`]);
        }

        return indexs;
    }
    private computeUv(points: cc.Vec2[], width: number, height: number) {
        let uvs: cc.Vec2[] = [];
        for (let p of points) {
            let x = this.clamp(0, 1, (p.x + width / 2) / width);
            let y = this.clamp(0, 1, 1 - (p.y + height / 2) / height);
            uvs.push(cc.v2(x, y));
        }
        return uvs;
    }

    private clamp(min: number, max: number, value: number) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        }
        return value;
    }
    /**
     * 监测一个点是否在三角形内
     * @param  {cc.Vec2} point
     * @param  {cc.Vec2} a
     * @param  {cc.Vec2} b
     * @param  {cc.Vec2} c
     */
    private isInTriangle(point: cc.Vec2, a: cc.Vec2, b: cc.Vec2, c: cc.Vec2) {
        const isEqualSign = (n1: number, n2: number) => {
            return (n1 > 0 && n2 > 0) || (n1 < 0 && n2 < 0);
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