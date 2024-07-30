import { createRoot, Root } from "react-dom/client";
import type { Moment } from "moment";
import {
  App,
  Events,
  ItemView,
  TAbstractFile,
  TFile,
  WorkspaceLeaf,
} from "obsidian";
import store from "../redux/store";
import { Provider } from "react-redux";
import {
  getAllNotes,
  getNotes,
  INotes,
  openOrCreateNote,
} from "../redux/notes";
// 配置 antd
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import Calendar from "../component/Calendar";
import { getDateFromFile } from "obsidian-daily-notes-interface";
import { NoteType, Granularity } from "src/enum";
import CalendarPlugin from "src/main";
import { JSX } from "react";

export const VIEW_TYPE_CALENDAR = "chinese-calendar-view";
const VIEW_TYPE_CALENDAR_SCALE = "chinese-calendar-view-scale";

type _App = App & { getAccentColor: () => string };

export class CalendarView extends ItemView {
  private root: Root | null = null;
  private plugin: CalendarPlugin | null = null;
  theme: {};

  constructor(leaf: WorkspaceLeaf, plugin: CalendarPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.theme = {
      token: {
        colorPrimary: (this.app as _App).getAccentColor(),
      },
      components: {
        Calendar: {
          fullBg: "transparent",
          fullPanelBg: "transparent",
        },
      },
    };
    this.onNoteSettingsUpdate = this.onNoteSettingsUpdate.bind(this);
    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileRenamed = this.onFileRenamed.bind(this);
    this._openOrCreateNote = this._openOrCreateNote.bind(this);
    this._render = this._render.bind(this);

    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.app.workspace as Events).on(
        "periodic-notes:settings-updated",
        this.onNoteSettingsUpdate
      )
    );
    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.app.workspace as Events).on(
        "chinese-calendar:settings-updated",
        this._render
      )
    );
    this.registerEvent(this.app.vault.on("create", this.onFileCreated));
    this.registerEvent(this.app.vault.on("delete", this.onFileDeleted));
    this.registerEvent(this.app.vault.on("rename", this.onFileRenamed));
  }

  // 根据插件配置变化加载文件
  private onNoteSettingsUpdate(): void {
    getAllNotes();
  }

  private onFileCreated(file: TAbstractFile): void {
    if (this.app.workspace.layoutReady && this.root) {
      this.updateNotes(file);
    }
  }

  private onFileDeleted(file: TAbstractFile): void {
    if (this.app.workspace.layoutReady && this.root) {
      this.updateNotes(file);
    }
  }

  private onFileRenamed(file: TAbstractFile): void {
    if (this.app.workspace.layoutReady && this.root) {
      this.updateNotes(file);
    }
  }

  private _openOrCreateNote(
    date: Moment,
    type: NoteType,
    notes: INotes[NoteType]
  ): void {
    openOrCreateNote(date, type, notes, this.app);
  }

  public updateNotes(file: TAbstractFile) {
    if (file instanceof TFile) {
      const map = {
        [Granularity.DAILY]: NoteType.DAILY,
        [Granularity.WEEKLY]: NoteType.WEEKLY,
        [Granularity.MONTHLY]: NoteType.MONTHLY,
        [Granularity.QUARTERLY]: NoteType.QUARTERLY,
        [Granularity.YEARLY]: NoteType.YEARLY,
      };
      const g = [
        Granularity.DAILY,
        Granularity.WEEKLY,
        Granularity.MONTHLY,
        Granularity.QUARTERLY,
        Granularity.YEARLY,
      ].find((v) => getDateFromFile(file, v));
      if (g) {
        getNotes(map[g]);
      }
    }
  }

  public onResize(): void {
    const useScale = !!this.plugin?.options.appearance.useScale;

    // 调整窗口
    if (useScale) {
      this.resize();
    }
  }

  private resize(): void {
    const dom = document.getElementById(VIEW_TYPE_CALENDAR);
    const scaleDom = document.getElementById(VIEW_TYPE_CALENDAR_SCALE);
    if (dom && scaleDom) {
      const clientWidth = dom.offsetWidth;
      const clientHeight = dom.offsetHeight;
      const widthRatio = clientWidth / 400;
      const heightRatio = clientHeight / 450;
      scaleDom.style.transform = `scale(${Math.min(widthRatio, heightRatio)})`;
    }
  }

  // 视图类型
  getViewType() {
    return VIEW_TYPE_CALENDAR;
  }

  getDisplayText() {
    return "日历";
  }

  getIcon(): string {
    return "calendar-with-checkmark";
  }

  // 打开时的初始化操作
  async onOpen() {
    // 初始化所有笔记
    getAllNotes();

    // 调整窗口
    const useScale = !!this.plugin?.options.appearance.useScale;
    if (useScale) {
      this.resize();
    }

    this._render();
  }

  public _render() {
    const useScale = !!this.plugin?.options.appearance.useScale;
    const container = (dom: JSX.Element) => (
      <div
        id={VIEW_TYPE_CALENDAR}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          id={VIEW_TYPE_CALENDAR_SCALE}
          style={{ width: "400px", height: "450px" }}
        >
          {dom}
        </div>
      </div>
    );
    const dom = (
      <ConfigProvider theme={this.theme} locale={zhCN}>
        <Provider store={store}>
          <Calendar openOrCreateNote={this._openOrCreateNote} />
        </Provider>
      </ConfigProvider>
    );
    // 生成dom
    this.root?.unmount();
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(useScale ? container(dom) : dom);
  }

  // 关闭时的资源释放操作
  async onClose() {
    this.root?.unmount();
  }
}
