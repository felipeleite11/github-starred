import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { Sorter } from '../../utils/sorter' 

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
    page: 1
  }

  async componentDidMount() {
    const { navigation } = this.props
    const { page } = this.state

    this.setState({ 
      loading: true
    })

    const user = navigation.getParam('user')
    
    const response = await api.get(`/users/${user.login}/starred?per_page=${itemsPerPage}&page=${page}`)

    const stars = Sorter.sort(response.data, 'name')

    this.setState({ 
      stars,
      loading: false
    })
  }

  async componentDidUpdate(_, prevState) {
    const { page, stars } = this.state
    
    if(prevState.page !== page) {
      const { navigation } = this.props
      const user = navigation.getParam('user')

      this.setState({ 
        refreshing: true 
      })

      const response = await api.get(`/users/${user.login}/starred?per_page=${itemsPerPage}&page=${page}`)

      const ordered = Sorter.sort(response.data, 'name')

      this.setState({ 
        stars: [...stars, ...ordered],
        refreshing: false
      })
    }
  }

  loadMore = () => {
    this.setState({ page: this.state.page + 1 })
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
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
              onEndReachedThreshold={0.2}
              onEndReached={this.loadMore}
              //ref={i => this.starListRef = i}
              refreshing={refreshing}
            />
          )
        }
      </Container>
    )
  }
}
