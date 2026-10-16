/**
 * Tournament API routes
 */

import express from 'express';
import { asyncHandler, validateBody } from '../middleware/validation.js';
import * as controller from '../controllers/tournamentController.js';

const router = express.Router();

// Health check
router.get('/health', controller.healthCheck);

// Get rules
router.get('/rules', controller.getRules);

// Validate tournament
router.post('/tournaments/validate', validateBody, asyncHandler(controller.validateTournament));

// Preview round (calculate without saving)
router.post('/tournaments/:tournamentId/rounds/preview', validateBody, asyncHandler(controller.previewRound));

// Complete round
router.post('/tournaments/:tournamentId/rounds/complete', validateBody, asyncHandler(controller.completeRound));

// Validate shot
router.post('/tournaments/:tournamentId/score/validate', validateBody, asyncHandler(controller.validateShot));

export default router;
