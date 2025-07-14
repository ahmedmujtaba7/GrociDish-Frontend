import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; // Adjust the path to your store
import AppNavigator from './navigation/AppNavigator'; // Adjust the path to your navigator
const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
