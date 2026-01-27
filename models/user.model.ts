import mongoose from "mongoose";

interface IUser {
  _id      : mongoose.Types.ObjectId;
  name     : string;
  email    : string;
  password ?: string;
  mobile   : string;
  image    : string;
  role     : "user" | "deliveryBoy" | "admin";
   location: {
    type: {
        type: StringConstructor;
        enum: string[];
        default: string;
    };
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    };
   }
}

const userSchema = new mongoose.Schema<IUser>({
  name     : { type : String, required : true },
  email    : { type : String, required : true, unique : true },
  password : { type : String, required : false },
  mobile   : { type : String, required : false },
  role     : { type : String, enum : ["user", "deliveryBoy", "admin"], default : "user" },
  image    : { type : String },
  location : {
      type : {
        type    : String,
        enum    : ["Point"],
        default : "Point"
      },
      coordinates : {
        type    : [Number], // latitude and longitude
        default : [0,0]
      }
  }
},{ timestamps : true }) // createdAt and updatedAt 

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default UserModel