import React from 'react';
import {
    Text,
    Image,
    View,
    KeyboardAvoidingView,
    Dimensions,
    ImageBackground,
    TextInput,
    Button,
    Platform,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import DataServices from '../data/service'
import styles from "../assets/styles";
import PulseLoader from "../components/PulseLoader";

const backGroundImage = require("../assets/images/bg.png")

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: 'Luke Skywalker',
            password: '19BBY',
            people: [],
            loading:false
        }
    }

    async componentWillMount() {
      
    }
    login = async() => {

        if (this.state.username == '') {
            alert('Enter username')
            return;
        }else if(this.state.password == ''){
            alert('Enter password')
            return;
        }

        this.setState({loading:true})
        let peopleArr = await DataServices
        .StarwarsService
        .getPeople()
    if (peopleArr == null) {
        let persons = await DataServices
            .StarwarsService
            .people()
        if (persons) {
            peopleArr = await DataServices
                .StarwarsService
                .getPeople()
            if (peopleArr != null) {
                this.setState({
                    people: JSON.parse(peopleArr)
                })
            }
        }

    } else {
        this.setState({
            people: JSON.parse(peopleArr)
        })
    }
    if(this.state.people != null){
        let login = await DataServices
            .StarwarsService
            .doLogin(this.state.username, this.state.password, this.state.people)
        if (login) {
            this
                .props
                .navigation
                .navigate('Planets', {
                    user: this.state.username,
                    people:this.state.people
                
                })
                this.setState({loading:false})

        } else {
            this.setState({loading:false})
            alert('Invalid Credentials')
        }
    }
    }
    render() {
           if (this.state.loading) {
            return (<PulseLoader
                avatar={backGroundImage}
                size={128}
                backgroundColor={"#4FC3F755"}
                borderColor={"#0288D1"}/>)
        }
        return (

            <View style={{
                flex: 1
            }}>
                <ImageBackground source={backGroundImage} style={styles.backgroundImage}>

                    <View style={styles.loginContainer}>
                        <KeyboardAvoidingView
                            style={{
                            backgroundColor: 'transparent'
                        }}
                            keyboardVerticalOffset=
                            { Platform.OS == 'ios' ? 0 : -30}
                            scrollEnabled={false}
                            behavior="position">

                            <View
                                style={{
                                margin: 10
                            }}>
                                <Text
                                    style={{
                                    marginTop: 10,
                                    color: '#ffab91'
                                }}>
                                    Username
                                </Text>
                                <TextInput
                                    style={{
                                    height: 40,
                                    borderColor: 'gray',
                                    borderBottomWidth: 0.5,
                                    marginTop: 10,
                                    color: 'white'
                                }}
                                    onChangeText={(username) => this.setState({username})}
                                    value={this.state.username}/>
                                <Text
                                    style={{
                                    marginTop: 10,
                                    color: '#ffab91'
                                }}>
                                    Password
                                </Text>
                                <TextInput
                                    style={{
                                    height: 40,
                                    borderColor: 'gray',
                                    borderBottomWidth: 0.5,
                                    marginTop: 10,
                                    color: 'white'
                                }}
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}/>

                            </View>
                            <TouchableHighlight
                                onPress={() => {
                                this.login()
                            }}>
                                <View
                                    style={{
                                    marginTop: 10,
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f44336',
                                    marginLeft: 20,
                                    marginRight: 20,
                                    borderRadius: 25
                                }}>

                                    <Text
                                        style={{
                                        color: 'white'
                                    }}>
                                        Login
                                    </Text>

                                </View>
                            </TouchableHighlight>
                        </KeyboardAvoidingView>
                    </View>

                </ImageBackground>

            </View>

        )
    }

}