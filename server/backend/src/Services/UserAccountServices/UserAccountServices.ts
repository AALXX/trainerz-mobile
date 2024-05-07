import { Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomRequest, query } from '../../config/mysql';
import logging from '../../config/logging';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import UtilFunc from '../../util/utilFunctions';

const NAMESPACE = 'UserAccountService';

/**
 * Validates and cleans the CustomRequest form
 */
const CustomRequestValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

/**
 * Gets a personal user account data by User Private Token
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetUserAccountData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const GetUserDataQueryString = `SELECT UserName, Description, BirthDate, LocationCountry, LocationCity, Sport, UserEmail, UserVisibility, AccountType, UserPublicToken FROM users WHERE UserPrivateToken='${req.params.accountPrivateToken}';`;

        const data = await query(connection, GetUserDataQueryString);
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
            });
        }

        return res.status(200).json({
            error: false,
            userData: data[0],
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Change  users data
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_ACCOUNT_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const changeUserDataSQL = `UPDATE users SET 
        UserName='${req.body.userName}', 
        Description='${req.body.userDescription}',
        UserEmail='${req.body.userEmail}', 
        Sport='${req.body.sport}',
        AccountType='${req.body.accountType}',
        userVisibility='${req.body.userVisibility}' WHERE UserPrivateToken='${req.body.userPrivateToken}';`;
        await query(connection, changeUserDataSQL);

        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Register User
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const RegisterUser = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('REGISTER_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const hashedpwd = await UtilFunc.HashPassword(req.body.password);

    const jwtSecretKey = 'secret' + hashedpwd + req.body.userEmail;
    const privateData = {};

    const publicData = {};

    const userPrivateToken = jwt.sign(privateData, jwtSecretKey);

    const userPublicToken = jwt.sign(publicData, `${process.env.ACCOUNT_REGISTER_SECRET}`);

    const InsertUserQueryString = `
    INSERT INTO users (UserName, Description, BirthDate, LocationCountry, LocationCity, Sport, UserEmail, UserPwd, UserVisibility, AccountType, UserPrivateToken, UserPublicToken)
    VALUES('${req.body.userName}', '${req.body.description}', 
    '${req.body.userBirthDate}', '${req.body.locationCountry}', 
    '${req.body.locationCity}', '${req.body.sport}', '${req.body.userEmail}', '${hashedpwd}', 'public', '${req.body.accountType}', '${userPrivateToken}', '${userPublicToken}');`;

    try {
        const connection = await req.pool?.promise().getConnection();
        await query(connection, InsertUserQueryString);
        fs.mkdir(`../accounts/${userPublicToken}/`, (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                });
            }

            res.status(202).json({
                error: false,
                userprivateToken: userPrivateToken,
                userpublictoken: userPublicToken,
            });
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Logs the User into account
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const LoginUser = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LOGiN_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const LoginQueryString = `SELECT UserPrivateToken, UserPublicToken, UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;

        const accountVideosDB = await query(connection, LoginQueryString);

        const data = JSON.parse(JSON.stringify(accountVideosDB));
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userprivateToken: null,
            });
        }
        bcrypt.compare(req.body.password, data[0].UserPwd, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: true,
                });
            } else if (!isMatch) {
                return res.status(200).json({
                    error: false,
                    userprivateToken: null,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    userprivateToken: data[0].UserPrivateToken,
                    userpublicToken: data[0].UserPublicToken,
                });
            }
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

export default {
    GetUserAccountData,
    ChangeUserData,
    RegisterUser,
    LoginUser,
};
