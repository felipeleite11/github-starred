import React, { Component } from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import { Sorter } from '../../utils/sorter' 

import api from '../../services/api'

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author, LoaderContainer } from './styles'

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Favoritos de ${navigation.getParam('user').name}`
  })
  
  state = {
    stars: [],
    loading: true
  }

  async componentDidMount() {
    const { navigation } = this.props

    this.setState({ loading: true })

    const user = navigation.getParam('user')
    
    const response = await api.get(`/users/${user.login}/starred`)

    const stars = Sorter.sort(response.data, 'name')
    
    this.setState({ stars })

    this.setState({ loading: false })
  }

  render() {
    const { stars, loading } = this.state
    const { navigation } = this.props
    const user = navigation.getParam('user')

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? 
          (
            <LoaderContainer>
              <ActivityIndicator color="#7159c1" size="large" />
            </LoaderContainer>
          ) :
          (
            <Stars 
              data={stars}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )
        }
      </Container>
    )
  }
}
