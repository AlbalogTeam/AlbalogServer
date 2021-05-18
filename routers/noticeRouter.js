import express from "express";
// import {create, deleteNotice, editNotice, getAllNotices, getANotice} from
import * as noticeController from "../controllers/noticeController";

import mongoose from "mongoose";

const noticeRouter = new express.Router();

noticeRouter.post('/create', noticeController.create);

noticeRouter.get('/', noticeController.getAllNotices);
noticeRouter.get('/:id', noticeController.getANotice);

noticeRouter.patch('/edit/:id', noticeController.editNotice);

noticeRouter.delete('/delete/:id', noticeController.deleteNotice);


export default noticeRouter;