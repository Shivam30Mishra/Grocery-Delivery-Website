import connectDB from "@/app/lib/db";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}: {params: {orderId: string}}){
  try{
    await connectDB()
    const {orderId} = params
    const {status}  = await req.json()
    const order     = OrderModel.findById(orderId).populate("user")
    if(!order){
      return NextResponse.json({message : "Order not found"}, {status:400})
    }
    order.status = status
    await order.save()
    let availableDeliveryBoys : any = []
    if(status === "out of delivery" && !order.assignment){
      availableDeliveryBoys = await UserModel.find({role : "delivery_boy", status : "active"})
    }
  }catch(error){
    console.log(error)
    return NextResponse.json({error : "Internal Server Error"}, {status : 500})
  }
}