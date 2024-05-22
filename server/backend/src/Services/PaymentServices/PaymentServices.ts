import { Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomRequest } from '../../config/mysql';
import logging from '../../config/logging';
import utilFunctions from '../../util/utilFunctions';
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

const CreateCustomer = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CREATE_CUSTOMER', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const customer = await req.stripe?.customers.create({
            email: req.body.email,
        });
        res.send({ customer });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
};

const CreateSubscription = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CREATE_CUSTOMER', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const { paymentMethodId } = req.body;

    try {
        const UserEmail = await utilFunctions.getUserEmailFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (UserEmail != null) {
            const customers = await req.stripe?.customers.list({ email: UserEmail });
            const products = await req.stripe?.products.list();
            // Find the product with the matching name
            const product = products!.data.find((p) => p.metadata.PublicToken === req.body.AccountPublicToken);
            if (customers != null && product != null) {
                await req.stripe?.paymentMethods.attach(paymentMethodId, { customer: customers.data[0].id });
                await req.stripe?.customers.update(customers.data[0].id, {
                    invoice_settings: { default_payment_method: paymentMethodId },
                });

                const prices = await req.stripe?.prices.list({
                    product: product.id,
                    active: true, // Only list active prices (optional)
                });

                const subscription = await req.stripe?.subscriptions.create({
                    customer: customers.data[0].id,
                    items: [{ price: prices?.data[0].id }],
                    expand: ['latest_invoice.payment_intent'],
                });
                return res.send(subscription);
            }
            return res.status(200).send({ error: true });
        }
        return res.status(200).send({ error: true });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
};

const CheckSubscription = async (req: CustomRequest, res: Response) => {
    try {
        const UserEmail = await utilFunctions.getUserEmailFromPrivateToken(req.pool!, req.body.UserPrivateToken);

        if (UserEmail != null) {
            const customers = await req.stripe?.customers.list({ email: UserEmail });
            const products = await req.stripe?.products.list();
            // Find the product with the matching name
            const product = products!.data.find((p) => p.metadata.PublicToken === req.body.AccountPublicToken);
            // Retrieve all subscriptions for the customer
            if (customers != null && product != null) {
                if (customers.data == null) {
                    res.json({ isSubscribed: false });
                }

                const subscriptions = await req.stripe?.subscriptions.list({
                    customer: customers.data[0].id,
                    status: 'active', // Optional: Filter by active subscriptions
                });

                // Check if any subscription includes the specified product
                const isSubscribed = subscriptions!.data.some((subscription) => subscription.items.data.some((item) => item.price.product === product!.id));

                res.json({ isSubscribed });
            }
            res.json({ isSubscribed: false });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const CancelSubscription = async (req: CustomRequest, res: Response) => {
    try {
        const UserEmail = await utilFunctions.getUserEmailFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (UserEmail != null) {
            const customers = await req.stripe?.customers.list({ email: UserEmail });
            const products = await req.stripe?.products.list();
            // Find the product with the matching name
            const product = products!.data.find((p) => p.metadata.PublicToken === req.body.AccountPublicToken);
            // Retrieve all subscriptions for the customer
            if (customers != null && product != null) {
                const subscriptions = await req.stripe?.subscriptions.list({
                    customer: customers.data[0].id,
                    status: 'active', // Optional: Filter by active subscriptions
                });

                await req.stripe?.subscriptions.cancel(subscriptions!.data[0].id);

                return res.json({ error: false });
            }
            return res.json({ error: true });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default { CreateCustomer, CreateSubscription, CheckSubscription, CancelSubscription };
