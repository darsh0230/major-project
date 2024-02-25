import { createSlice } from "@reduxjs/toolkit"
import { AppState } from "./store"

// Initial state
const initialState: { isTestCaseModalOpen: boolean } = {
  isTestCaseModalOpen: true,
}

// Actual Slice
export const utilSlice = createSlice({
  name: "utilSlice",
  initialState,
  reducers: {
    updateUtilVars: (state, action) => {
      state = { ...state, ...action.payload }
      console.log(state)
    },
  },
})

export const { updateUtilVars } = utilSlice.actions

export const selectUtilVar = (state: AppState) => state.utilSlice

export default utilSlice.reducer
