import React, { Component } from 'react'
import { ActivityIndicator, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native'

import api from '../../services/api'

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author, LoaderContainer } from './styles'

const itemsPerPage = 10

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Favoritos de ${navigation.getParam('user').name}`
  })
  
  state = {
    stars: [],
    loading: true,     // Substitui a FlatList por um ActivityIndicator
    refreshing: false, // Reduz a opacidade da FlatList
    page: 1,
    user: null
  }

  componentDidMount() {
    const { navigation } = this.props

    const user = navigation.getParam('user')

    this.setState({ user }, () => {
      this.refreshList()
    })
  }

  refreshList = async () => {
    this.setState({ 
      loading: true,
      page: 1
    })

    const { user } = this.state    

    const response = await api.get(`/users/${user.login}/starred?per_page=${itemsPerPage}&page=${1}`)

    console.tron.log(`Página ${1} - ${response.data.length} itens`)

    const stars = response.data.map(star => ({ 
      id: star.id, 
      name: star.name, 
      avatar_url: star.owner.avatar_url, 
      login: star.owner.login,
      html_url: star.html_url 
    }))

    this.setState({ 
      stars: stars,
      loading: false
    })
  }

  loadMore = async () => {
    const { page, stars, user } = this.state

    this.setState({ refreshing: true })

    const response = await api.get(`/users/${user.login}/starred?per_page=${itemsPerPage}&page=${page + 1}`)

    const newStars = response.data.map(star => ({ 
      id: star.id, 
      name: star.name, 
      avatar_url: star.owner.avatar_url, 
      login: star.owner.login,
      html_url: star.html_url 
    }))

    this.setState({ 
      page: response.data.length ? page + 1 : page,
      stars: [...stars, ...newStars],
      refreshing: false
    }, () => {
      console.tron.log(`Página ${this.state.page} - ${stars.length + response.data.length} itens`)
    })
  }

  handleNavigation = (repo) => {
    const { navigation } = this.props
    navigation.navigate('Repo', { repo })
  }

  render() {
    const { stars, loading, refreshing } = this.state
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
                <TouchableNativeFeedback onPress={() => this.handleNavigation(item)}>
                  <Starred>
                    <OwnerAvatar source={{ uri: item.avatar_url }} />
                    <Info>
                      <Title>{item.name}</Title>
                      <Author>{item.login}</Author>
                    </Info>
                  </Starred>
                </TouchableNativeFeedback>
              )}
              onEndReachedThreshold={0.2}
              onEndReached={this.loadMore}
              refreshing={refreshing}
              onRefresh={this.refreshList}
            />
          )
        }
      </Container>
    )
  }
}
