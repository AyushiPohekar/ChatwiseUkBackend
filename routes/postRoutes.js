import {Router} from 'express';
import { addComment, addPost, deleteComment, deletePost, getAllPosts, getPostById, likePost, unlikePost, updateComment, updatePost } from '../Controllers/PostControllers.js';


const postRouter=Router();

postRouter.get('/',getAllPosts);
postRouter.get('/:postId',getPostById);
 postRouter.post('/',addPost)
postRouter.put('/:postId',updatePost)
postRouter.delete('/:postId',deletePost)
//like dislike post
postRouter.put('/:postId/like',likePost)
postRouter.delete('/:postId/unlike',unlikePost)

//comments

postRouter.post('/:postId/comments',addComment)
postRouter.put('/:postId/comments/:commentId',updateComment)
postRouter.delete('/:postId/comments/:commentId',deleteComment)


export default postRouter