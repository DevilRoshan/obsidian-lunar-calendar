import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { get, merge } from "lodash-es";
import { NoteType } from "../enum";
import store from "./store";
import { DeepPartial } from "src/util/DeepPartial";

export interface INoteConfig {
  useQuickAdd?: boolean;
  quickAddChoice?: string;
}

export enum LayoutMode {
  Normal = "Normal",
  Small = "Small",
}

export interface ISetting {
  [NoteType.DAILY]: INoteConfig;
  [NoteType.WEEKLY]: INoteConfig;
  [NoteType.MONTHLY]: INoteConfig;
  [NoteType.QUARTERLY]: INoteConfig;
  [NoteType.YEARLY]: INoteConfig;
  appearance: {
    useScale: boolean;
    layout: LayoutMode;
    pastTimeTransparent: boolean;
  };
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
  appearance: {
    useScale: false,
    layout: LayoutMode.Normal,
    pastTimeTransparent: false
  },
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    saveSetting: (state, action: PayloadAction<DeepPartial<ISetting>>) => {
      return merge({}, state, action.payload);
    },
  },
});

export const getSettings = (type: string) => {
  return get(store.getState().setting, type);
};

// Action creators are generated for each case reducer function
export const { saveSetting } = settingSlice.actions;

export default settingSlice.reducer;
