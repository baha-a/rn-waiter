import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'

export default class Loader extends Component {
  render() {
    return (
        <ActivityIndicator size='large' />
    )
  }
}
