import express from "express"
import { protectRoute } from "../middleware/authMiddleWare.js";
import { acceptFriendRequest, getFriendRequests, getMyData, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controller/userController.js";

const router = express.Router();

//Apply auth middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendReqs);

router.get('/me',getMyData);

export default router;