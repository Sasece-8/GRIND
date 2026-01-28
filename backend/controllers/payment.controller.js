import Stripe from 'stripe';
import Course from '../models/course.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Calculate amount (Stripe expects amount in subunits - e.g., cents/paise)
        // Ensure price is at least minimal amount for Stripe (approx $0.50 equivalent)
        const amount = Math.round(course.price * 100); 

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr', // Change based on your requirement
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                courseId: courseId,
                userId: userId
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
};
