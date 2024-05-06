import express from 'express';
import { body, param } from 'express-validator';

import UserAccountServices from '../../Services/UserAccountServices/UserAccountServices';

const router = express.Router();

router.post(
    '/register-account',

    body('userName').not().isEmpty(),
    body('userEmail').isEmail().not().isEmpty(),
    body('password').isLength({ min: 4 }).not().isEmpty().trim(),
    body('sport').not().isEmpty(),
    body('description'),
    body('accountType').not().isEmpty(),
    body('userBirthDate').not().isEmpty(),
    body('locationCity').not().isEmpty(),
    body('locationCountry').not().isEmpty(),
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

// //* Account data
router.get('/get-account-data/:accountPrivateToken', param('accountPrivateToken').not().isEmpty(), UserAccountServices.GetUserAccountData);

router.post(
    '/change-user-data',
    body('userName').not().isEmpty(),
    body('userEmail').not().isEmpty(),
    body('userDescription'),
    body('userGender').not().isEmpty(),
    body('userPartenerGender').not().isEmpty(),
    body('userFitnessGoal'),
    body('userFavoriteGym'),
    body('userBestPr'),
    body('userLookingForAprtenerMotive'),
    body('userGymTime').not().isEmpty(),
    body('userTimeSpentInGym'),
    body('userVisibility'),
    body('userToken').not().isEmpty(),
    UserAccountServices.ChangeUserData,
);

// router.post('/delete-user-account', body('userToken').not().isEmpty(), UserAccountServices.DeleteUserAccount);

// router.post('/change-user-icon', UserAccountServices.ChangeUserIcon);

// router.post('/upload-user-image', UserAccountServices.UploadImage);


export = router;
