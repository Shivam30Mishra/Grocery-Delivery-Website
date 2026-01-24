import { createSlice } from "@reduxjs/toolkit";

interface IUser {
  _id      : mongoose.Types.ObjectId;
  name     : string;
  email    : string;
  password ?: string;
  mobile   : string;
  image    : string;
  role     : "user" | "deliveryBoy" | "admin";
}

interface IUserSlice{
  userData : IUser | null
}

const initialState : IUserSlice = {
  userData : null,

}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    
  }
})