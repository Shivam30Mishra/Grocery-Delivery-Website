import connectDB from "@/app/lib/db";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    await connectDB()
    const { userId, items, paymentMethod, totalAmount, address } = await req.json()
    if(!userId || !items || !paymentMethod || !totalAmount || !address){
      return NextResponse.json({error: "All fields are required"}, {status: 400})
    }
    const user = await UserModel.findById(userId)
    if(!user){
      return NextResponse.json({error: "User not found"}, {status: 404})
    }else{
      const newOrder = await OrderModel.create({
        user : userId,
        items,
        paymentMethod,
        totalAmount,
        address
      })
      return NextResponse.json({message: "Order placed successfully",newOrder}, {status: 201})
    }
    
  }catch(err){
    console.log(err)
    return NextResponse.json({error: "place Order error"}, {status: 500})
  }
}