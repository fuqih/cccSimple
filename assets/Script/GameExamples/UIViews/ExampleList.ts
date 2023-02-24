import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { UIManager } from "../../GameSystems/UIManager";
import AVirtualScrollView from "../../GameUtilitys/CommonUtilitys/AVirtualScrollView";
import ScrollOptimizer from "../../GameUtilitys/CommonUtilitys/ScrollOptimizer";
import ListItem from "../CommonItems/ListItem";

const { ccclass, property } = cc._decorator;

/**
 * 分帧，缓存，虚拟列表(优化性能优化内存优化dc)
 * 
 */
@ccclass
export default class ExampleList extends BaseUIKeeperView {
    @property(cc.Prefab) itemPrefab: cc.Prefab = null;
    @property(cc.Node) itemContent: cc.Node = null;
    @property(cc.ScrollView) scrollView: cc.ScrollView = null;
    @property(AVirtualScrollView) vScrollView: AVirtualScrollView = null;
    private items: ListItem[] = [];
    private scrollOptimizer: ScrollOptimizer = null;
    public onOpen(fromUI: number, ...args: any): void {
        this.scrollOptimizer = new ScrollOptimizer(this.scrollView.node);
        // this.testFrameLoad()

        var dataL: string[] = [];
        for (var i = 0; i < 100; i++) {
            dataL.push(i + "");
        }
        this.vScrollView.refreshData(dataL);
    }

    closeWnd() {
        this.getArchitecture().GetSystem(UIManager).close(this)
    }
    addItems() {
    }

    testFrameLoad() {
        let self = this
        function* getGenerator() {
            for (let i = 0; i < 100; i++) {
                let nd = cc.instantiate(self.itemPrefab)
                nd.getComponent(ListItem).init(i)
                nd.parent = self.itemContent
                yield;
            }
        }
        this._frameLoad(getGenerator(), 1);
    }

    /**
     * 分帧执行 Generator 逻辑
     * @param generator 生成器
     * @param duration ms 超时则留到下一帧
     */
    _frameLoad(generator: Generator, duration: number) {
        return new Promise<void>((resolve, reject) => {
            const execute = () => {
                let startTime = Date.now();
                for (let iter = generator.next(); ; iter = generator.next()) {
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }
                    if (Date.now() - startTime > duration) {
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };
            execute();
        })
    }
}