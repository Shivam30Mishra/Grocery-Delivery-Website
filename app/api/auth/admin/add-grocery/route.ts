import uploadOnCloudinary from "@/app/lib/cloudinary";
import connectDB from "@/app/lib/db";
import { auth } from "@/auth";
import GroceryModel from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,res:NextResponse){
  try{
    await connectDB()
    const sesion = await auth()
    if(!sesion || !sesion.user || sesion.user.role !== "admin"){
      return NextResponse.json({error:"Unauthorized"}, {status:401})
    }
    const formData = await req.formData()
    const name     = formData.get("name")     as string
    const category = formData.get("category") as string
    const price    = formData.get("price")    as string
    const unit     = formData.get("unit")     as string
    const file     = formData.get("image")    as Blob | null
    if(!name || !category || !price || !file || !unit){
      return NextResponse.json({error:"All fields are required"}, {status:400})
    }
    let imageUrl
    if(file){
      imageUrl = await uploadOnCloudinary(file)
    }
    const grocery = await GroceryModel.create({
      name,
      category,
      price,
      image : imageUrl,
      unit 
    })
    return NextResponse.json({grocery}, {status:201})
  }catch(error){
    console.log(error)
    return NextResponse.json({error:"Failed to add grocery"}, {status:500})
  }
}