import database from "@/Database/Database"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"

export async function PUT(req, res) {
    try {
        const { followerId, followingId } = await req.json()  // followerId - matlab jo follow kar rha hai uski Id following id - matlab jisse follow karna hai uski Id
        await database()
        const followingUser = await userModel.findById(followingId);
        const followerUser = await userModel.findById(followerId);
        if (!followingUser) {
            return NextResponse.json({ message: "No user Found", success: false });
        }
        if (!followerUser) {
            return NextResponse.json({ message: "No user Found", success: false });
        }

        let user;
        let user2;
        let message;

        if (followingUser.followers.includes(followerId)) {

            user = await userModel.findByIdAndUpdate(
                followingId,
                { $pull: { followers: followerId } },
                { new: true }
            );
           user2= await userModel.findByIdAndUpdate(
                followerId,
                {$pull:{following:followingId}},
                {new:true}
            )
            message = 'Unfollowed';
        } else {

            user = await userModel.findByIdAndUpdate(
                followingId,
                { $addToSet: { followers: followerId } },
                { new: true }
            );
          user2 =   await userModel.findByIdAndUpdate(
                followerId,
                {$addToSet:{following:followingId}},
                {new:true}
            )
            message = 'Followed';
        }

        return NextResponse.json({
            message,
            success: true,
            user,
            user2
        });
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: 'Server Error',
            success: false
        })
    }
}