// Import the screens
import Login from './components/Login';
import CreateAccount from './components/createAccount';
import Chat from './components/Chat';
// Import React Navigation
import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack'

// Create the navigator
const navigatorScreen = createStackNavigator({
  Login: { screen: Login },
  CreateAccount: { screen: CreateAccount },
  Chat: { screen: Chat },
},
{
  initialRouteName: 'Login',
}
);

const navigator = createAppContainer(navigatorScreen);

// Export it as the root component
export default navigator