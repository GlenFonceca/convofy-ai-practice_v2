import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const getMyData = (req,res)=>{
  res.status(200).json({success:true , user:req.user});
};

export async function getRecommendedUsers(req,res) {

    try {
        const currentUserId = req.user.id;

        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and:[
                { _id: {$ne : currentUserId}}, // exclude yourself 
                { _id: {$nin :currentUser.friends}}, // exclude your friends 
                {isOnboarded: true},
            ],
        });

        res.status(200).json(recommendedUsers);
        
    } catch (error) {
      console.log("Error in getRecommended controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req,res) {

    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends" , "fullName profilePic nativeLanguage learningLanguage isPremium");

        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getFriends controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    } 
}

export async function sendFriendRequest(req,res) {
    try {

        const myId = req.user.id;
        const {id:recipientId} = req.params; //from the url getting the id.

        if(myId === recipientId){
            return res.status(500).json({message: "You Can't Send Friend Req to YourSelf"});
        }

        const recipient = await User.findById(recipientId);

        if(!recipient){
            return res.status(500).json({message: "Recipient not Found"});
        }

        //Check if user is Already a Friend
        if(recipient.friends.includes(myId)){
            return res.status(500).json({message: "You are Already friends with this User"});
        }

        //check if a request Already exists
        const existingRequest  = await FriendRequest.findOne({
            $or : [
                {sender: myId , recipient : recipientId},
                {sender : recipientId , recipient : myId},
            ],
        });

        if(existingRequest){
            return res.status(400).json({message: "A Friend request Already exists with this User"});
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient :recipientId,
        });

        res.status(201).json(friendRequest);
        
    } catch (error) {
      console.log("Error in sendfriendRequest controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {

    //This is used for sending all the requests in the notification
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    //Used fot notify that user has accepted the Request
    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Make sure that we don't get option to send request again once we sent a request to a User
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
