import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Moment } from "moment";
import { NoteType } from "../enum";
import { TFile } from "obsidian";
import store from "./store";
import {
  getAllDailyNotes,
  getAllWeeklyNotes,
  getAllMonthlyNotes,
  getAllQuarterlyNotes,
  getAllYearlyNotes,
  getDailyNote,
  getMonthlyNote,
  getYearlyNote,
  getQuarterlyNote,
  getWeeklyNote,
  getDailyNoteSettings,
  getWeeklyNoteSettings,
  getMonthlyNoteSettings,
  getQuarterlyNoteSettings,
  getYearlyNoteSettings,
  createDailyNote,
  createWeeklyNote,
  createMonthlyNote,
  createQuarterlyNote,
  createYearlyNote,
} from "obsidian-daily-notes-interface";
import { createConfirmationDialog } from "../view/ConfirmModal";
import { getSettings } from "./setting";
// lunar 地址 https://6tail.cn/calendar/api.html#overview.html
import { HolidayUtil, Lunar, Solar } from "lunar-typescript";
import { noteConfigMap } from "src/view/SettingView";

export interface INoteConfig {
  useQuickAdd?: boolean;
  quickAddChoice?: string;
}

export interface INotes {
  [NoteType.DAILY]: Record<string, TFile> | null;
  [NoteType.WEEKLY]: Record<string, TFile> | null;
  [NoteType.MONTHLY]: Record<string, TFile> | null;
  [NoteType.QUARTERLY]: Record<string, TFile> | null;
  [NoteType.YEARLY]: Record<string, TFile> | null;
}

export const initialState: INotes = {
  [NoteType.DAILY]: null,
  [NoteType.WEEKLY]: null,
  [NoteType.MONTHLY]: null,
  [NoteType.QUARTERLY]: null,
  [NoteType.YEARLY]: null,
};

export const settingSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    saveNotes: (state, action: PayloadAction<Partial<INotes>>) => {
      return Object.assign({}, state, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveNotes } = settingSlice.actions;

export const getNotes = (type: NoteType) => {
  const funMap = {
    [NoteType.DAILY]: getAllDailyNotes,
    [NoteType.WEEKLY]: getAllWeeklyNotes,
    [NoteType.MONTHLY]: getAllMonthlyNotes,
    [NoteType.QUARTERLY]: getAllQuarterlyNotes,
    [NoteType.YEARLY]: getAllYearlyNotes,
  };
  const notes = funMap[type]();
  store.dispatch(saveNotes({ [type]: notes }));
};

export const noteIsExists = (
  date: Moment,
  type: NoteType,
  notes: INotes[NoteType]
) => {
  const funMap = {
    [NoteType.DAILY]: getDailyNote,
    [NoteType.WEEKLY]: getWeeklyNote,
    [NoteType.MONTHLY]: getMonthlyNote,
    [NoteType.QUARTERLY]: getQuarterlyNote,
    [NoteType.YEARLY]: getYearlyNote,
  };
  if (!notes) {
    return null;
  }
  return funMap[type](date, notes);
};

export const getAllNotes = () => {
  [
    NoteType.DAILY,
    NoteType.WEEKLY,
    NoteType.MONTHLY,
    NoteType.QUARTERLY,
    NoteType.YEARLY,
  ].map((v) => {
    getNotes(v);
  });
};

export const formatDate = (date: Moment) => {
  const d = Lunar.fromDate(date.toDate());
  const solarTerm = d.getJieQi();
  const s = Solar.fromDate(date.toDate());
  const solarFestivals = s.getFestivals();
  const displayHoliday =
    solarFestivals.length > 0
      ? solarFestivals[0].length < 4
        ? solarFestivals[0]
        : undefined
      : undefined;
  const dispalyDay =
    d.getDay() === 1 ? d.getMonthInChinese().concat("月") : d.getDayInChinese();
  const h = HolidayUtil.getHoliday(
    date.get("year"),
    date.get("month") + 1,
    date.get("date")
  );
  return {
    dateStr: displayHoliday || solarTerm || dispalyDay,
    isWork: h && h.isWork(),
    isHoliday: !!h,
  };
};

export const formatMonth = (date: Moment) => {
  const d = Lunar.fromDate(new Date(date.get("year"), date.get("month")));
  return d.getMonthInChinese();
};

export const formatLabel = (date: Moment) => {
  const year = date.year();
  const month = date.month();
  const d = Lunar.fromDate(new Date(year, month));
  return `${d.getYearInGanZhi()}${d.getYearShengXiao()}年${d.getMonthInChinese()}月`;
};

export const createNoteQuickAdd = async (
  date: Moment,
  type: NoteType,
  filename: string,
  quickAddChoice: string
) => {
  let params: any = {};
  if (type === NoteType.DAILY) {
    const d = Lunar.fromDate(date.toDate());
    const s = Solar.fromDate(date.toDate());
    params.chineseYear = `${d.getYearInGanZhi()}${d.getYearShengXiao()}年`;
    params.chineseMonth = `${d.getMonthInChinese()}月`;
    params.chineseDay = `${d.getDayInChinese()}`;
    let lunar = `${params.chineseYear}${params.chineseMonth}${params.chineseDay}`;
    let solarTerm = d.getJieQi();
    if (solarTerm) {
      lunar += " ";
      lunar += solarTerm;
    }
    params.solarTerm = solarTerm || "";
    let dateStr = filename;
    const solarFestivals = s.getFestivals();
    let festivals =
      solarFestivals.length > 0
        ? solarFestivals[0].length < 4
          ? solarFestivals[0]
          : undefined
        : undefined;
    if (festivals) {
      dateStr += " ";
      dateStr += festivals;
    }
    params.festivals = festivals || "";
    params.lunar = lunar;
    params.dateStr = dateStr;
  }
  if (type === NoteType.WEEKLY) {
    const { format } = getDailyNoteSettings();
    params.start = date.startOf("week").format(format);
    params.end = date.endOf("week").format(format);
  }
  if (type === NoteType.MONTHLY) {
    const { format } = getDailyNoteSettings();
    params.start = date.startOf("month").format(format);
    params.end = date.endOf("month").format(format);
  }
  if (type === NoteType.QUARTERLY) {
    const { format } = getDailyNoteSettings();
    params.start = date.startOf("quarter").format(format);
    params.end = date.endOf("quarter").format(format);
  }
  if (type === NoteType.YEARLY) {
    const { format } = getDailyNoteSettings();
    params.start = date.startOf("year").format(format);
    params.end = date.endOf("year").format(format);
  }
  params.filename = filename;
  params.year = date.year();
  params.month = date.month();
  params.label = noteConfigMap[type].title;
  (window.app as any).plugins.plugins.quickadd.api.executeChoice(
    quickAddChoice,
    params
  );
};

export const createNote = async (date: Moment, type: NoteType) => {
  const createNoteFunc = {
    [NoteType.DAILY]: createDailyNote,
    [NoteType.WEEKLY]: createWeeklyNote,
    [NoteType.MONTHLY]: createMonthlyNote,
    [NoteType.QUARTERLY]: createQuarterlyNote,
    [NoteType.YEARLY]: createYearlyNote,
  };
  return createNoteFunc[type](date);
};

export const openOrCreateNote = async (
  date: Moment,
  type: NoteType,
  notes: INotes[NoteType]
) => {
  const getNoteSettings = {
    [NoteType.DAILY]: getDailyNoteSettings,
    [NoteType.WEEKLY]: getWeeklyNoteSettings,
    [NoteType.MONTHLY]: getMonthlyNoteSettings,
    [NoteType.QUARTERLY]: getQuarterlyNoteSettings,
    [NoteType.YEARLY]: getYearlyNoteSettings,
  };
  const { workspace } = window.app;
  const existingFile = noteIsExists(date, type, notes);
  if (!existingFile) {
    // File doesn't exist
    const { format } = getNoteSettings[type]();
    const { useQuickAdd, quickAddChoice } = getSettings(type);
    const filename = date.format(format);

    const createFile = async () => {
      // 判断是否使用quickAdd
      let note = null;
      if (useQuickAdd && quickAddChoice) {
        note = await createNoteQuickAdd(date, type, filename, quickAddChoice);
        return;
      } else {
        note = await createNote(date, type);
      }
      const leaf = workspace.getLeaf(false);

      await leaf.openFile(note, { active: true });
    };

    createConfirmationDialog({
      cta: "创建",
      onAccept: createFile,
      text: `文件 ${filename} 不存在，是否创建？`,
      title: `新建${noteConfigMap[type].title}`,
    });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leaf = workspace.getLeaf(false);
  await leaf.openFile(existingFile, { active: true });
};

export default settingSlice.reducer;
