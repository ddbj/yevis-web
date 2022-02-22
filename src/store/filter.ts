import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PublishStatus = 'published' | 'draft'
export type WfType = 'CWL' | 'WDL' | 'NFL' | 'SMK'
export type SortType = 'name' | 'date'

export interface FilterState {
  wfName: string
  authors: string[]
  publishStatus: PublishStatus[]
  wfType: WfType[]
  sortBy: SortType
}

const initialState: FilterState = {
  wfName: '',
  authors: [],
  publishStatus: ['published', 'draft'],
  wfType: ['CWL', 'WDL', 'NFL', 'SMK'],
  sortBy: 'date',
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setWfName: (state, action: PayloadAction<FilterState['wfName']>) => {
      state.wfName = action.payload
    },

    setAuthors: (state, action: PayloadAction<FilterState['authors']>) => {
      state.authors = action.payload
    },

    // multiple
    setPublishStatus: (state, action: PayloadAction<PublishStatus>) => {
      if (state.publishStatus.includes(action.payload)) {
        state.publishStatus = state.publishStatus.filter(
          (s) => s !== action.payload
        )
      } else {
        state.publishStatus.push(action.payload)
      }
    },

    // multiple
    setWfType: (state, action: PayloadAction<WfType>) => {
      if (state.wfType.includes(action.payload)) {
        state.wfType = state.wfType.filter((t) => t !== action.payload)
      } else {
        state.wfType.push(action.payload)
      }
    },

    setSortBy: (state, action: PayloadAction<SortType | null>) => {
      if (action.payload === null) {
        if (state.sortBy === 'date') {
          state.sortBy = 'name'
        } else {
          state.sortBy = 'date'
        }
      } else {
        state.sortBy = action.payload
      }
    },
  },
})

export const { setWfName, setAuthors, setPublishStatus, setWfType, setSortBy } =
  filterSlice.actions

export default filterSlice.reducer