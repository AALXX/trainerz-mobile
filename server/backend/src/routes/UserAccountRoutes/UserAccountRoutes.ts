import express from 'express';
import { body, param } from 'express-validator';

import UserAccountServices from '../../Services/UserAccountServices/UserAccountServices';

const router = express.Router();

router.post(
    '/register-account',

    body('userName').not().isEmpty(),
    body('userEmail').isEmail().not().isEmpty(),
    body('password').isLength({ min: 4 }).not().isEmpty().trim(),
    body('phoneNumber').not().isEmpty(),
    body('sport').not().isEmpty(),
    body('accountPrice'),
    body('description'),
    body('accountType').not().isEmpty(),
    body('userBirthDate').not().isEmpty(),
    // body('locationCity').not().isEmpty(),
    // body('locationCountry').not().isEmpty(),
    UserAccountServices.RegisterUser,
);


router.post('/login-account', body('userEmail').isEmail().not().isEmpty(), body('password').isLength({ min: 4 }).not().isEmpty().trim(), UserAccountServices.LoginUser);
// router.post('/send-change-user-password-email', body('userToken').not().isEmpty(), UserAccountServices.SendPwdLinkToEmail);
// router.get('/check-pwd-change-link/:tokenLink/:email', param('tokenLink').not().isEmpty(), UserAccountServices.CheckResetPasswordLinkValability);
// router.post(
//     '/change-user-account-password',
//     body('oldPassword').isLength({ min: 4 }).not().isEmpty(),
//     body('newPassword').isLength({ min: 4 }).not().isEmpty(),
//     body('userEmail').not().isEmpty(),
//     UserAccountServices.ChangeUserPasswod,
// );

//* Account data
router.get('/get-account-data/:accountPrivateToken', param('accountPrivateToken').not().isEmpty(), UserAccountServices.GetUserAccountData);

router.get('/get-account-public-data/:accountPublicToken', param('accountPublicToken').not().isEmpty(), UserAccountServices.GetUserAccountPublicData);

router.get('/get-account-subscriptions/:userPrivateToken', param('userPrivateToken').not().isEmpty(), UserAccountServices.GetUserAccountSubscriptions);

router.post(
    '/change-user-data',
    body('userName').not().isEmpty(),
    body('userEmail').not().isEmpty(),
    body('userDescription'),
    body('sport').not().isEmpty(),
    body('price').not().isEmpty(),
    body('accountType').not().isEmpty(),
    body('userVisibility').not().isEmpty(),
    body('userPrivateToken').not().isEmpty(),
    UserAccountServices.ChangeUserData,
);

router.post('/upload-user-image', UserAccountServices.UploadPhoto);
router.post('/change-user-icon', UserAccountServices.ChangeUserIcon);

router.get('/get-account-photos/:accountPublicToken', param('accountPublicToken').not().isEmpty(), UserAccountServices.GetAccountPhotos);


// router.post('/delete-user-account', body('userToken').not().isEmpty(), UserAccountServices.DeleteUserAccount);


export = router;
