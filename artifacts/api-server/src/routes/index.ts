import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import jobsRouter from "./jobs";
import applicationsRouter from "./applications";
import companiesRouter from "./companies";
import resumesRouter from "./resumes";
import aiRouter from "./ai";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(jobsRouter);
router.use(applicationsRouter);
router.use(companiesRouter);
router.use(resumesRouter);
router.use(aiRouter);
router.use(notificationsRouter);
router.use(dashboardRouter);

export default router;
