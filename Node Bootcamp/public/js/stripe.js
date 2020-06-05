import axios from "axios";
import { showAlert } from "./alert";
const stripe = Stripe('pk_test_edNW5gMjscA4Rnj5nwaItZ5A00REYqHtc9');

export const bookTour = async tourId => {
    // get checkout session from endpoint
    try {
        const session = await axios({
            method: 'get',
            url: `/api/v1/bookings/checkout-session/${tourId}`
        })
        console.log(session);

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        showAlert('error', err.message)
    }


}