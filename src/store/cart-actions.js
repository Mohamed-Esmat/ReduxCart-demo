import { cartActions } from './cart-slice';
import { uiActions } from './ui-slice';

export const fetchCartData = () => {
  return async (dispatch) => {
    //I wanna wrap a fetchData with try catch it after, that why i'm putting it into a separate function
    const fetchData = async () => {
      const response = await fetch(
        'https://redux-0452-default-rtdb.firebaseio.com/cart.json'
      );

      if (!response.ok) {
        throw new Error('Could not fetch cart data!');
      }
      const data = await response.json();
      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        //if there is no items in the cart we need to set an empty array as initial state for our reducer
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Fetching cart data failed!',
        })
      );
    }
  };
};

//Create our own action creator
//We create an action creator that not return simple action object but instead return a function
export const sendCartData = (cart) => {
  return async (dispatch) => {
    //Dispatch the pending status
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      })
    );

    //Create a async function to send the request and catch the errors if any
    const sendRequest = async () => {
      const response = await fetch(
        'https://redux-0452-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Sending cart data failed!');
      }
    };

    try {
      await sendRequest();
      //Is no errors dispatch the success status
      // const responseData = await response.json();
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          // message: `${
          //   Object.keys(responseData).length
          // } items added to the cart!`,
          message: 'Data sent successfully!',
        })
      );
    } catch (error) {
      //Catch any errors
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: `Something went wrong! Please try again later.`,
        })
      );
    }
  };
};
