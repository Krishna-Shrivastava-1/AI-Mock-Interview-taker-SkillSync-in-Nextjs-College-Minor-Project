import axios from "axios"
import { NextResponse } from "next/server"
// const BACKEND_SECRET_KEY ='dsdsvs564s1dvs54v6s6v1'
export async function GET(req,res) {
 
  // const apiKey = req.headers.get('X-API-Key');
  // console.log(apiKey);

  // if (!BACKEND_SECRET_KEY) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }
  const feed = process.env.allfeedURL
  try {
    if (!feed) {
      return NextResponse.json({
        messgae:'no feed url found for headline'
      })
    }
    const { data } = await axios.get(feed)
   
if (!data) {
    return NextResponse.json({
        message:'No data found'
    })
}
    return NextResponse.json({data })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message:'Server error'
    })
  }
}