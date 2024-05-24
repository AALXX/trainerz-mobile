import express from 'express';
import { body } from 'express-validator';

import PaymentServices from '../../Services/PaymentServices/PaymentServices';

const router = express.Router();

router.post(
    '/withdraw',
    body('UserPrivateToken').not().isEmpty(),
    PaymentServices.WithdrowMoney,
);

router.post('/create-subscription', body('paymentMethodId').not().isEmpty(), body('UserPrivateToken').not().isEmpty(), body('AccountPublicToken').not().isEmpty(), PaymentServices.CreateSubscription);

router.post('/check-subscription', body('UserPrivateToken').not().isEmpty(), body('AccountPublicToken').not().isEmpty(), PaymentServices.CheckSubscription);

router.post('/cancel-subscription', body('UserPrivateToken').not().isEmpty(), body('AccountPublicToken').not().isEmpty(), PaymentServices.CancelSubscription);

export = router;
