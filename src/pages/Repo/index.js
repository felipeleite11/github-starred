import React, { Component } from 'react'
import { WebView } from 'react-native-webview'

export default class Repo extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Repositório: ${navigation.getParam('repo').name}`
  })

  render() {
    const { navigation } = this.props
    const repo = navigation.getParam('repo')

    return (
        <WebView
            source={{ uri: repo.html_url }}
            style={{ flex: 1 }}
        />
    )
  }
}
