import request from "../modal/Request.js";
import User from "../modal/User.js";



export const FriendRequest=async(req,res)=>{
    try {
        const { senderId, receiverId } = req.body;
  console.log(senderId)

    const friendrequest = new request({
      sender: senderId,
      receiver: receiverId
    });

     // Update sender's status to 'requestSent'
     await User.findByIdAndUpdate(senderId, { status: 'requestSent' });  //status is updated as requestsent

     // Update receiver's status to 'requestReceived'
     await User.findByIdAndUpdate(receiverId, { status: 'requestReceived' });//status is updated as requestrecieved
 
  
 

    // Save the friend request
    await friendrequest.save();

    res.status(200).send(friendrequest).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Failed to send the friend request.' });
    }
}

//get friend request of a particular user

export const getFriendRequestByUser=async(req,res)=>{
  try {
    const { userId } = req.params;

    // Find all friend requests where the user is either the sender or receiver
    const requests = await request.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });

    console.log(requests)

    if (requests.length === 0) {
      return res.status(404).json({ error: 'No friend requests found for the user.' });
    }
 res.status(200).json(requests);
    // // Get the usernames of senders and receivers
    // const requestsWithUsernames = await Promise.all(requests.map(async (request1) => {
    //   const sender = await User.findById(request1.sender);
    //   const receiver = await User.findById(request1.receiver);

    //   return {
    //     requestId: request1._id,
    //     sender: sender.username,
    //     receiver: receiver.username,
    //     status: request1.status
    //   };
    // }));

    // res.status(200).json({ friendRequests: requestsWithUsernames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve friend requests.' });
  }
}


//Accept a friendRequest

export const AcceptfriendRequest=async(req,res)=>{
  try {
    const { requestId } = req.params;

   
    const request1 = await request.findById(requestId);

    if (!request1) {
      return res.status(404).json({ error: 'Friend request not found.' });
    }

    
    request1.status = 'accept';
    await request1.save();

    // Get the sender and receiver information
    const sender = await User.findById(request1.sender);
    const receiver = await User.findById(request1.receiver);

     // Update the friends arrays of sender and receiver
     sender.friends.push(receiver._id);
     receiver.friends.push(sender._id);
 
     await sender.save();
     await receiver.save();
 

    res.status(200).json({
      message: 'Friend request accepted successfully.',
      sender: sender.username,
      receiver: receiver.username
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Failed to accept friend request"})
  }
}
export const RejectFriendRequest=async(req,res)=>{
  try {
    const { requestId } = req.params;

   
    const request1 = await request.findById(requestId);

    if (!request1) {
      return res.status(404).json({ error: 'Friend request not found.' });
    }

    
    request1.status = 'reject';
    await request1.save();

    // Get the sender and receiver information
    const sender = await User.findById(request1.sender);
    const receiver = await User.findById(request1.receiver);

    res.status(200).json({
      message: 'Friend request rejected successfully.',
      sender: sender.username,
      receiver: receiver.username
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Failed to reject friend request"})
  }
}
export const KeepFriendRequestPending=async(req,res)=>{
  try {
    const { requestId } = req.params;

   
    const request1 = await request.findById(requestId);

    if (!request1) {
      return res.status(404).json({ error: 'Friend request not found.' });
    }

    
    request1.status = 'pending';
    await request1.save();

    // Get the sender and receiver information
    const sender = await User.findById(request1.sender);
    const receiver = await User.findById(request1.receiver);

    res.status(200).json({
      message: 'Friend request is pending.',
      sender: sender.username,
      receiver: receiver.username
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Some error occured"})
    
  }
}