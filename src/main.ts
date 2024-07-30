import { App, Plugin } from "obsidian";
import { CalendarView, VIEW_TYPE_CALENDAR } from "./view/CalendarView";
import SettingView from "./view/SettingView";
import { ISetting, saveSetting, initialState } from "./redux/setting";
import store from "./redux/store";

// 插件对象
export default class CalendarPlugin extends Plugin {
  public options: ISetting = initialState;

  // 插件开启时执行初始化操作
  async onload() {
    this.register(
      store.subscribe(() => {
        this.options = store.getState().setting;
      })
    );

    // 注册日历视图
    this.registerView(
      VIEW_TYPE_CALENDAR,
      (leaf) => new CalendarView(leaf, this)
    );

    this.addCommand({
      id: "show-chinese-calendar-view",
      name: "打开日历视图",
      checkCallback: (checking: boolean) => {
        if (checking) {
          return (
            this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).length === 0
          );
        }
        this.initLeaf();
      },
    });

    // 加载插件设置
    await this.loadOptions();

    this.addSettingTab(new SettingView(this.app, this));

    this.app.workspace.onLayoutReady(this.initLeaf.bind(this));
  }

  async loadOptions(): Promise<void> {
    const options = await this.loadData();
    store.dispatch(saveSetting(options));
    await this.saveData(this.options);
  }

  async writeOptions(changeOpts: () => Partial<ISetting>): Promise<void> {
    store.dispatch(saveSetting(changeOpts()));
  }

  async saveOptions() {
    await this.saveData(this.options);
    this.app.workspace.trigger("chinese-calendar:settings-updated");
  }

  initLeaf(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false)?.setViewState({
      type: VIEW_TYPE_CALENDAR,
    });
  }
}
