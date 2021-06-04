import express from 'express';
const router = new express.Router();

import * as employeeController from '../controllers/employeeController';
import userAuth from "../middleware/userAuth";

/**
 *  @employeeRoute
 *  /api/v1/employee
 * */

//create employee
router.post('/:id/signup', userAuth, employeeController.create_employee);
router.post('/login', userAuth, employeeController.login_employee);
router.post('/logout', userAuth, employeeController.logout_employee);

module.exports = router;