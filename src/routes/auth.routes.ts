import { Router as AuthRouter } from 'express';
import { register as registerCtlAuth, login as loginCtlAuth, registerAdmin as registerAdminCtlAuth } from '../controllers/auth.controller';
const authRouter = AuthRouter();
authRouter.post('/register', registerCtlAuth);
authRouter.post('/register-admin', registerAdminCtlAuth);
authRouter.post('/login', loginCtlAuth);
export default authRouter;