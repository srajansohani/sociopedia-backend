import express from 'express';
import { verifyToken } from '../middleware/auth';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts';

const router = express.Router();

//READ
router.get('/',verifyToken,getFeedPosts);
router.get('/:userId/posts',verifyToken,getUserPosts);

//Update

router.patch('/:id/like',verifyToken,likePost);
