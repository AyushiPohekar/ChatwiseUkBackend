import Post from "../modal/Post.js";
import User from "../modal/User.js";

//get All posts
export const getAllPosts = async (req, res) => {
  let posts;
  try {
    posts = await Post.find();
  } catch (error) {
    console.log(error);
  }
  if (!posts) {
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  return res.status(200).json({ posts });
};

//get post by Id

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the post." });
  }
};

// Create new post
export const addPost = async (req, res) => {
  try {
    const { title, description, image, location, userId } = req.body;

    const newPost = new Post({
      title,
      description,
      image,
      location,
      userId,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add the post." });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description, image, location, userId } = req.body;

    let post = await Post.findByIdAndUpdate(postId, {
      title,
      description,
      image,
      location,
      userId,
    });

    res.status(201).json({ message: "Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add the post." });
  }
};

//delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndRemove(postId);
    if (!post) {
      return res.status(404).json({ error: "No post found" });
    }
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the post." });
  }
};

//like post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "User already liked the post." }); //user has already liked post
    }

    post.likes.push(userId); //userId pushed in likes array of post
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add the like." });
  }
};

//unlike post
export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex === -1) {
      return res.status(400).json({ error: "User has not liked the post." }); //if user already liked the post
    }

    // Unlike the post
    post.likes.splice(likedIndex, 1);
    await post.save();

    res.status(200).json({ message: "Post unliked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unlike the post." });
  }
};

//add comment
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId, //new comment created
      content,
      createdAt: new Date(),
    };

    post.comments.push(newComment); //adding comment to post schema
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add the comment." });
  }
};

//updateComment
export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, content } = req.body;

    console.log(userId);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId); //finding comment of particularid
    console.log(comment.userId.toHexString());
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.userId.toHexString() !== userId) {
      return res.status(403).json({ error: "You cannot update this comment" }); //if userId in route do not match that in userId of comment array then we take action
    }

    //update
    comment.content = content || comment.content;
    comment.updatedAt = new Date();

    //save
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the comment." });
  }
};

//deleteComment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const { userId } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.userId.toHexString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this comment." }); //user has created comment or not
    }

    // const commentIndex = post.comments.indexOf(commentId);
    post.comments.splice(commentId, 1);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the comment." });
  }
};

//get friends post
export const getbyfriends = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(_id);
    // Find the user by ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get the friends of the user
    const friends1 = user.friends;
    console.log(friends1.toLocaleString());
    // Find posts from the friends of the user
    const posts = await Post.find({ author: { $in: friends1 } });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve posts from friends." });
  }
};
