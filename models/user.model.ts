import mongoose from "mongoose";

interface IUser {
  _id      : mongoose.Types.ObjectId;
  name     : string;
  email    : string;
  password : string;
  mobile   : string;
  image    : string;
  role     : "user" | "deliveryBoy" | "admin";
}

const userSchema = new mongoose.Schema<IUser>({
  name     : { type : String, required : true },
  email    : { type : String, required : true, unique : true },
  password : { type : String, required : true },
  mobile   : { type : String, required : false },
  role     : { type : String, enum : ["user", "deliveryBoy", "admin"], default : "user" },
  image    : { type : String }
},{ timestamps : true }) // createdAt and updatedAt

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default UserModel