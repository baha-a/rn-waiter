import React, { Component} from 'react';
import { Platform } from 'react-native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default class Loader extends Component {
   render() {
      return (
         <View style = {styles.container}>
            <ActivityIndicator color='#bc2b78' size={Platform.OS == "android"? 50 : "large"} style={styles.activityIndicator}/>
         </View>
      )
   }
}

const styles = StyleSheet.create ({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   }
})