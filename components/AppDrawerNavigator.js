import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/Settings';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/notificationScreen'
import MyRecievedBookScreen from '../screens/MyRecievedBooksScreen';
export const AppDrawerNavigator = createDrawerNavigator({
        Home : {
          screen : AppTabNavigator
          },
        MyDonations : {
          screen : MyDonationScreen
        },
        Notification : {
          screen : NotificationScreen
        },
        MyRecievedBooks:{
           screen : MyRecievedBookScreen
        },
        Setting : {
          screen : SettingScreen
        }
      },
        {
          contentComponent:CustomSideBarMenu
        },
        {
          initialRouteName : 'Home'
        })



