import express from 'express';
const router = new express.Router();

import employeeController from '../controllers/employeeController';
import staffAuth from '../middleware/staffAuth';

/**
 *  @employeeRoute
 *  /api/v1/employee
 * */

//create employee
router.post('/:id/signup', employeeController.create_employee);

module.exports = router;
