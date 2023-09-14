import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { fetchCartData, sendCartData } from './store/cart-actions';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const cartIsVisible = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  //dispatch the cartData form my server whenever the application starts
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }

    //We will use sendCartData as a action creator
    //This may sound weird, cuz we always were dispatching action creators as functions that return an action object with a type and so on, Now in cart-slice we're instead dispatching a function that return another function, But the great thing about Redux when using Redux toolkit, is that it's prepared for that,It does not just accept action objects with a type property, Instead it also does accept action creators that return functions. And if it sees that you're dispatching an action which actually a function instead of action object it will execute that function for you, So Redux will execute that function for you, And with that function i mean the returned function, It will give us that dispatch argument automatically, so that inside that executed function we can dispatch again, because there's a such a common pattern that we wannna have action creators that can perform side effects, And that can then dispatch other actions, which eventually reached the reducers as part of  a flow off side-effects, or as a flow of steps that should be taken. And that what we have here, So we can use a function that returns another function as action as well tha is built in Redux when using Redux toolkit .
    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  return (
    <React.Fragment>
      {notification && <Notification {...notification} />}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </React.Fragment>
  );
}

export default App;
