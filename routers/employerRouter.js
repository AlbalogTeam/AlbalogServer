import express from 'express';
const router = new express.Router();
import employerController from '../controllers/employerController';

router.post('/signup', employerController.create_employer);

module.exports = router;
