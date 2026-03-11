import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    grpSymbols:{}
}

const initialState: GroupState = {
    grpSymbols:{}
}

const GroupSlice = createSlice({
  name: "Groups",
  initialState, 
  reducers: {
     getGrpSymbols:(state, action: PayloadAction<any[]>)=>{
       state.grpSymbols = action.payload;
     }
  }})

  export const {getGrpSymbols}= GroupSlice.actions;

  export default GroupSlice.reducer;