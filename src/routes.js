import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Main from './pages/Main'
import User from './pages/User'
import Repo from './pages/Repo'

const Router = createAppContainer(
    createStackNavigator({
        Main,
        User,
        Repo
    }, {
        headerLayoutPreset: 'center',
        headerBackTitleVisible: false,
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#7159C1'
            },
            headerTintColor: '#FFF'
        }
    })
)

export default Router