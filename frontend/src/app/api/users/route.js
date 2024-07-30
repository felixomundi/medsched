import { NextResponse } from 'next/server'
import client from '@/app/libs/prismadb';
export  async function GET(request) {  
  try {
    const users = await client.user.findMany();
     return NextResponse.json(
        { "users":users }, 
        { status: 200 });
  } catch (error) {
   if(error){
      return NextResponse.json(
         { error: "error" }, 
         { status: 500 });
   }
  }

}
export  async function POST(request) {  
   try {
     const body = await request.json()
      const {name, email} =body
      let data = {
         name,email
      }
      const newUser = await client.user.create({
      data    
      })
      return NextResponse.json(
         { newUser }, 
         { status: 200 });
   } catch (error) {
    if(error){
       return NextResponse.json(
          { error, message:"Error in creating user" }, 
          { status: 500 });
    }
   }
 
 }