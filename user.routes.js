import { Router } from 'express';
import * as uc from './user.controller.js';

const userRouter = Router();

userRouter.post('/signup', uc.signup);
userRouter.post('/login', uc.login);
userRouter.patch('/:id', uc.updateUser);
userRouter.delete('/', uc.deleteUser);
userRouter.get('/', uc.getUserById);

export default userRouter;