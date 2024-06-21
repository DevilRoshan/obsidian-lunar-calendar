import { App, PluginSettingTab, Setting } from "obsidian";
import dayjs from "dayjs";

import { NoteType } from "../enum";
import { createRoot } from "react-dom/client";
import NoteInput from "../component/NoteInput";
import { get, set } from "lodash-es";
import CalendarPlugin from "src/main";

export interface INoteConfigItem {
  title: string;
  key: NoteType;
}

export const noteConfigMap = {
  [NoteType.DAILY]: {
    title: "每日笔记",
    key: NoteType.DAILY,
  },
  [NoteType.WEEKLY]: {
    title: "每周笔记",
    key: NoteType.WEEKLY,
  },
  [NoteType.MONTHLY]: {
    title: "每月笔记",
    key: NoteType.MONTHLY,
  },
  [NoteType.QUARTERLY]: {
    title: "季度笔记",
    key: NoteType.QUARTERLY,
  },
  [NoteType.YEARLY]: {
    title: "年度笔记",
    key: NoteType.YEARLY,
  },
};

export default class MainSettingTable extends PluginSettingTab {
  plugin: CalendarPlugin;

  constructor(app: App, plugin: CalendarPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): any {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h3", {
      text: "使用Periodic Notes插件配置笔记文件路径，模板和存储文件夹",
    });
    containerEl.createEl("a", {
      href: "obsidian://show-plugin?id=periodic-notes",
      text: "Periodic Notes插件地址",
    });
    containerEl.createEl("hr");
    [
      noteConfigMap[NoteType.DAILY],
      noteConfigMap[NoteType.WEEKLY],
      noteConfigMap[NoteType.MONTHLY],
      noteConfigMap[NoteType.QUARTERLY],
      noteConfigMap[NoteType.YEARLY],
    ].map((v) => this.displayNoteSetting(v));
  }
  getSetting(path: string) {
    return get(this.plugin.options, path);
  }

  private displayNoteSetting(noteConfigItem: INoteConfigItem): void {
    const { containerEl } = this;

    containerEl.createEl("h3", { text: noteConfigItem.title });

    new Setting(containerEl)
      .setName(`是否使用 QuickAdd 模板功能`)
      .setDesc("需要提前安装QuickAdd插件 使用 QuickAdd 模板命令创建笔记")
      .addToggle((toggle) => {
        toggle.setValue(this.getSetting(`${noteConfigItem.key}.useQuickAdd`));
        toggle.onChange(async (value) => {
          this.plugin.writeOptions(() => ({
            [noteConfigItem.key]: {
              useQuickAdd: value,
            },
          }));
          this.display();
        });
      });

    if (this.getSetting(`${noteConfigItem.key}.useQuickAdd`)) {
      let folderDom = new Setting(containerEl);
      folderDom.settingEl.empty();
      const folder = this.getSetting(`${noteConfigItem.key}.quickAddChoice`);
      createRoot(folderDom.settingEl).render(
        <NoteInput
          title="QuickAdd 模板命令"
          subTitle={
            <>
              <div>
                配置要执行的QuickAdd模板命令，
                <a href="https://quickadd.obsidian.guide/docs/QuickAddAPI#executechoicechoicename-string-variables-key-string-any-promise">
                  参考API
                </a>{" "}
                传递给QuickAdd的参数：
                <a href="https://github.com/DevilRoshan/obsidian-lunar-calendar">
                  详见文档
                </a>{" "}
              </div>
            </>
          }
          value={folder}
          onChange={(value: string) => {
            this.plugin.writeOptions(() => ({
              [noteConfigItem.key]: {
                quickAddChoice: value,
              },
            }));
          }}
          onBulr={() => this.display()}
        />
      );
    }
  }
}
