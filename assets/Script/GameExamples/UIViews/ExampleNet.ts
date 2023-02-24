import { BaseUIKeeperView } from "../../GameBaseUIViews/BaseUIKeeperView";
import { NetManager } from "../../GameSystems/NetManager";
import { UIManager } from "../../GameSystems/UIManager";
import { DefStringProtocol, INetworkTips, NetData } from "../../GameUtilitys/NetWork/NetInterface";
import { NetNode } from "../../GameUtilitys/NetWork/NetNode";
import { WebSock } from "../../GameUtilitys/NetWork/WebSock";

class NetTips implements INetworkTips {
    private tipLabel: cc.Label = null;
    constructor(tip: cc.Label) {
        this.tipLabel = tip
    }
    private getLabel(): cc.Label {
        return this.tipLabel;
    }

    connectTips(isShow: boolean): void {
        if (isShow) {
            this.getLabel().string = "Connecting";
            this.getLabel().node.active = true;
        } else {
            this.getLabel().node.active = false;
        }
    }

    reconnectTips(isShow: boolean): void {
        if (isShow) {
            this.getLabel().string = "Reconnecting";
            this.getLabel().node.active = true;
        } else {
            this.getLabel().node.active = false;
        }
    }

    requestTips(isShow: boolean): void {
        if (isShow) {
            this.getLabel().string = "Requesting";
            this.getLabel().node.active = true;
        } else {
            this.getLabel().node.active = false;
        }
    }
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class UIExampleNet extends BaseUIKeeperView {
    @property(cc.Label) label: cc.Label = null;
    @property(cc.Label) labelNetTip: cc.Label = null;
    @property text: string = 'hello';

    private item: cc.Node = null;
    private asset: cc.Asset = null;

    private netMgr: NetManager = null;
    private ws: WebSocket = null;
    onLoad() {
        let Node = new NetNode();
        Node.init(new WebSock(), new DefStringProtocol(), new NetTips(this.labelNetTip));
        Node.setResponeHandler(0, (cmd: number, data: NetData) => {
            console.log('收到信息', data)
        });
        this.netMgr = this.getArchitecture().GetSystem(NetManager)
        this.netMgr.setNetNode(Node, 1)
    }
    onConnectClick() {
        this.netMgr.connect({ url: "ws://82.157.123.54:9010/ajaxchattest" }, 1);
    }

    onSendClick() {
        this.netMgr.send('发点什么', false, 1);
    }

    onDisconnectClick() {
        this.netMgr.close(1000, "xxxyyy", 1);
    }
    closeWnd() {
        this.netMgr.removeNetNode(1)
        this.getArchitecture().GetSystem(UIManager).close(this)
    }
    // update (dt) {}
    onDestroy(): void {
        super.onDestroy()//总要强制性调用surper，有没有更好的方法
    }
}
