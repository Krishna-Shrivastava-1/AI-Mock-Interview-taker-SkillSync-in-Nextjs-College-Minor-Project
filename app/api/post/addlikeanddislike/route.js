import database from "@/Database/Database"
import { postModel } from "@/Models/Post"
import { NextResponse } from "next/server"
import { broadcastUpdate } from "../../events/route";
import { userModel } from "@/Models/User";




export async function PUT(req) {
  try {
    const { userId, postId } = await req.json();
    await database();

    const post = await postModel.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "No post Found", success: false });
    }

    let updatedPost;
    if (post.likes.includes(userId)) {
      updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("user");
    } else {
      updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      ).populate("user");
    }

    // Broadcast to all SSE clients (only the updated post, not all posts)
    // broadcastUpdate({ type: "likeUpdate", updatedPost });

    return NextResponse.json({
      message: "Like/dislike updated",
      success: true,
      updatedPost
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error", success: false });
  }
}


// export async function PUT(req, res) {
//     try {
//         const { userId, postId } = await req.json()
//         await database()
//         const postfind = await postModel.findById(postId)
//         if (!postfind) {
//             return NextResponse.json({
//                 message: 'No post Found',
//                 success: false
//             })
//         }
//         let updatedPost
//         if (postfind?.likes?.includes(userId)) {
//             updatedPost = await postModel.findByIdAndUpdate(postId, {
//                 $pull: { likes: userId }
//             }, { new: true }).populate('user')
       
//             return NextResponse.json({
//                 message: 'user disliked this post',
//                 success: true,
//                 updatedPost
//             })
//         } else {
//             updatedPost = await postModel.findByIdAndUpdate(postId, {
//                 $addToSet: { likes: userId }
//             }, { new: true }).populate('user')
           
//             return NextResponse.json({
//                 message: 'user liked this post',
//                 success: true,
//                  updatedPost
//             })
//         }


//     } catch (error) {
//         console.log(error.message)
//         return NextResponse.json({
//             message: 'Server error',
//             succes: false,
//             status: 500
//         })
//     }
// }