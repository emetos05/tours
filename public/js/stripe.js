import axios from 'axios';
import catchAsync from '../../utilities/catchAsync';
import { showAlert } from './alerts';

export const bookTour = catchAsync(async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51Mj2kEJVDKDhIaww7dQYqVewh0EqCCg2JzLvGrmXPSEwnuoyG3pd3ApmNv76sV8OKTGoqVuzagUOC2pRgy64KKjn00QHAlsNs0'
    );

    // Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
});
