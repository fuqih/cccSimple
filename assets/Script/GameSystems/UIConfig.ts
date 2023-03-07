import { UIConf } from "./UIManager";

export enum UIID {
    Example,
    Example2,
    ExampleAssets,
    ExampleDCTex,
    ExampleJump,
    ExampleList,
    ExampleNet,
    ExampleNodeEvent,
    ExampleResLoad,
    ExampleResLoad2,
    ExampleScreenShoot,
}
export let UICF: { [key: number]: UIConf } = {
    [UIID.Example]: { prefab: "Prefabs/UIViews/Example" },
    [UIID.Example2]: { prefab: "Prefabs/UIViews/Example2" },
    [UIID.ExampleAssets]: { prefab: "Prefabs/UIViews/ExampleAssets" },
    [UIID.ExampleDCTex]: { prefab: "Prefabs/UIViews/ExampleDCTex" },
    [UIID.ExampleJump]: { prefab: "Prefabs/UIViews/ExampleJump" },
    [UIID.ExampleList]: { prefab: "Prefabs/UIViews/ExampleList" },
    [UIID.ExampleNet]: { prefab: "Prefabs/UIViews/ExampleNet" },
    [UIID.ExampleNodeEvent]: { prefab: "Prefabs/UIViews/ExampleNodeEvent" },
    [UIID.ExampleResLoad]: { prefab: "Prefabs/UIViews/ExampleResLoad" },
    [UIID.ExampleResLoad2]: { prefab: "Prefabs/UIViews/ExampleResLoad2" },
    [UIID.ExampleScreenShoot]: { prefab: "Prefabs/UIViews/ExampleScreenShoot" },
}
/** 界面展示类型 */
export enum UIShowTypes {
    UIFullScreen,       // 全屏显示，全屏界面使用该选项可获得更高性能
    UIAddition,         // 叠加显示，性能较差
    UISingle,           // 单界面显示，只显示当前界面和背景界面，相比全屏借助了背景。性能较好
};