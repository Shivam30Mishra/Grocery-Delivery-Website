import UserModel from "@/models/user.model";
import connectDB from "./lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EditRoleMobile from "@/components/EditRoleMobile";
import Nav from "@/components/Nav";


export default async function Home() {
  await connectDB
  const session = await auth()
  console.log("The Below is the session : ")
  console.log(session)
  const user = await UserModel.findById(session?.user?.id)
  if(!user){
    return redirect("/login")
  }
  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role=="user")
  if(inComplete){
    return <EditRoleMobile/>
  }
  return (
    <div>
      The home page
      <Nav user={user}/>
    </div>
  );
}
