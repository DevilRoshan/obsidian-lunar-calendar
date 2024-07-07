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

export const VIEW_TYPE_CALENDAR = "chinese-calendar-view";

type _App = App & { getAccentColor: () => string };

export class CalendarView extends ItemView {
  private root: Root | null = null;
  theme: {};

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
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

    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.app.workspace as Events).on(
        "periodic-notes:settings-updated",
        this.onNoteSettingsUpdate
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
  // (file: TAbstractFile) => any
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
    getAllNotes();
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(
      <ConfigProvider theme={this.theme} locale={zhCN}>
        <Provider store={store}>
          <Calendar openOrCreateNote={this._openOrCreateNote} />
        </Provider>
      </ConfigProvider>
    );
  }

  // 关闭时的资源释放操作
  async onClose() {
    this.root?.unmount();
  }
}
