import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash-es";
import { NoteType } from "../enum";
import store from "./store";

export interface INoteConfig {
  useQuickAdd?: boolean;
  quickAddChoice?: string;
}

export interface ISetting {
  [NoteType.DAILY]: INoteConfig;
  [NoteType.WEEKLY]: INoteConfig;
  [NoteType.MONTHLY]: INoteConfig;
  [NoteType.QUARTERLY]: INoteConfig;
  [NoteType.YEARLY]: INoteConfig;
}

export const initialState: ISetting = {
  [NoteType.DAILY]: {
    useQuickAdd: false,
    quickAddChoice: "",
  },
  [NoteType.WEEKLY]: {
    useQuickAdd: false,
    quickAddChoice: "",
  },
  [NoteType.MONTHLY]: {
    useQuickAdd: false,
    quickAddChoice: "",
  },
  [NoteType.QUARTERLY]: {
    useQuickAdd: false,
    quickAddChoice: "",
  },
  [NoteType.YEARLY]: {
    useQuickAdd: false,
    quickAddChoice: "",
  },
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    saveSetting: (state, action: PayloadAction<Partial<ISetting>>) => {
      return merge({}, state, action.payload);
    },
  },
});

export const getSettings = (type: NoteType) => {
  return store.getState().setting[type];
}

// Action creators are generated for each case reducer function
export const { saveSetting } = settingSlice.actions;

export default settingSlice.reducer;
