import connectDB from "@/app/lib/db";
import { auth } from "@/auth";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,res:NextResponse){
  try{
    await connectDB()
    const { role,mobile } = await req.json()
    const session = await auth()
    const user    = await UserModel.findOneAndUpdate({email : session?.user?.email},{
      role,
      mobile},{new : true})
    if(!user){
      return NextResponse.json({
        message : "User not found",
        status : 400
      })
    }
    return NextResponse.json({
      user,
      message : "User updated successfully",
      status : 200
    })


  }catch(error){
    console.log(error)
    return NextResponse.json({
      message : "Edit role and mobile failed errro",
      status : 500,
      error
    })

  }
}