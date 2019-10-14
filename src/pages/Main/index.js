import React, { Component } from 'react'
import { Keyboard, ActivityIndicator, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'

import api from '../../services/api'

import { 
    Container, 
    Form, 
    Input, 
    SubmitButton, 
    List,
    User,
    Avatar,
    Name,
    Bio,
    ProfileButton,
    ProfileButtonText,
    DeleteButton,
    DeleteButtonContainer } from './styles'

export default class Main extends Component {
    static navigationOptions = {
        title: 'Usuários Github'
    }

    state = {
        users: [],
        newUser: '',
        loading: false
    }

    async componentDidMount() {
        //AsyncStorage.removeItem('users')

        const users = await AsyncStorage.getItem('users')

        if(users) {
            this.setState({ users: JSON.parse(users) })
        }
    }

    componentDidUpdate(_, prevState) {
        const { users } = this.state

        if(prevState.users !== users) {
            AsyncStorage.setItem('users', JSON.stringify(users))
        }
    }

    handleAddUser = async () => {
        const { users, newUser } = this.state

        this.setState({ loading: true })

        try {
            const response = await api.get(`/users/${newUser}`)

            const { id, name, login, bio, avatar_url: avatar } = response.data

            const user = {
                id,
                name, 
                login, 
                bio, 
                avatar
            }

            this.setState({ users: [...users, user] })
        }
        catch(err) {
            Alert.alert(`Usuário ${newUser} não encontrado!`)
        }
        
        this.setState({
            newUser: '',
            loading: false
        })

        Keyboard.dismiss()
    }

    handleNavigate = (user) => {
        const { navigation } = this.props
        navigation.navigate('User', { user })
    }

    handleDelete = (user) => {
        const { users } = this.state
        this.setState({ users: users.filter(u => u.id !== user.id) })
        Alert.alert(`Usuário ${user.name} foi excluído!`)
    }

    render() {
        const { users, newUser, loading } = this.state

        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCaptalize="none"
                        placeholder="Adicionar usuário"
                        value={newUser}
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                    />

                    <SubmitButton onPress={this.handleAddUser} loading={loading}>
                        { loading ? 
                            <ActivityIndicator color="#fff" /> : 
                            <Icon name="add" size={20} color="#fff" /> 
                        }
                    </SubmitButton>
                </Form>

                <List 
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <>
                            <DeleteButtonContainer>
                                <DeleteButton onPress={() => this.handleDelete(item)}>
                                    <Icon name="delete" size={20} color="#ef5350" /> 
                                </DeleteButton>
                            </DeleteButtonContainer>

                            <User>
                                <Avatar source={{ uri: item.avatar }} />
                                <Name>{item.name}</Name>
                                <Bio>{item.bio}</Bio>
                                <ProfileButton onPress={() => this.handleNavigate(item)}>
                                    <ProfileButtonText>
                                        Ver perfil
                                    </ProfileButtonText>
                                </ProfileButton>
                            </User>
                        </>
                    )}
                />
            </Container>
        )
    }
}
