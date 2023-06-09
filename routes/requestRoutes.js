import {Router} from 'express';
import { AcceptfriendRequest, FriendRequest, KeepFriendRequestPending, RejectFriendRequest, getFriendRequestByUser } from '../Controllers/RequestController.js';
import { requireSignIn } from '../middlewares/authMiddlewares.js';



const requestRouter=Router();

requestRouter.post('/friendrequests',FriendRequest);
requestRouter.get('/friendrequests/:userId',getFriendRequestByUser)
requestRouter.put('/friendrequests/:requestId/accept',requireSignIn,AcceptfriendRequest)
requestRouter.put('/friendrequests/:requestId/reject',RejectFriendRequest)
requestRouter.put('/friendrequests/:requestId/pending',KeepFriendRequestPending)

export default requestRouter;