import express from 'express';
import { getUser,getUserFreinds } from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

router.get('/:id',verifyToken,getUser);
router.get('/:id/friends',verifyToken,getUserFreinds);


export default router;