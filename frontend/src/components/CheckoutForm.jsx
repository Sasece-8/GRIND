import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";

const CheckoutForm = ({ onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setProcessing(false);
            return;
        }

        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href, // This might need to be adjusted based on logic, but for simple handling we can catch it
            },
            redirect: 'if_required', // Handle success without redirect if suitable
        });

        if (paymentError) {
            setError(paymentError.message);
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setProcessing(false);
            onPaymentSuccess(paymentIntent.id);
        } else {
            setError("Payment status unknown. Please check your dashboard.");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {processing ? <Loader className="animate-spin w-5 h-5" /> : "Pay Now"}
            </button>
        </form>
    );
};

export default CheckoutForm;
