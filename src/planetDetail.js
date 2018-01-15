import React from 'react';
import {
    Text,
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';
import styles from "../assets/styles";
import NavigationBar from 'react-native-navbar';
import DataServices from '../data/service'
import PulseLoader from "../components/PulseLoader";
const backgroundImage = require("../assets/images/bg.png");

export default class PlanetDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            planet: {},
            loading: false,
            url: this.props.navigation.state.params.url
        }
    }

    async componentWillMount() {
        this.setState({loading: true})
        await DataServices
            .StarwarsService
            .clearPlanetData()
        let planetData = await DataServices
            .StarwarsService
            .planetData(this.state.url)
        if (planetData) {
            let planetDetailsData = await DataServices
                .StarwarsService
                .getPlanetData()
            if (planetDetailsData != null) {
                this.setState({
                    planet: JSON.parse(planetDetailsData),
                    loading: false
                })
            }

        }

    }
    async logout() {
        await DataServices.StarwarsService.clear()

        this
            .props
            .navigation
            .navigate('Login')
        
    }
    render() {
        if (this.state.loading) {
            return (<PulseLoader
                avatar={backgroundImage}
                size={128}
                backgroundColor={"#4FC3F755"}
                borderColor={"#0288D1"}/>)
        }
        const rightButtonConfig = {
            title: 'Logout',
            handler: () => this.logout()
        };
        const leftButtonConfig = {
            title: 'back',
            handler: () => this.props.navigation.goBack()
        };

        const titleConfig = {
            title: 'Planet Details'
        };
  
        return (
            <View style={styles.container}>
            <View
                style={Platform.OS =='ios'? styles.navigationBariOS : styles.navigationBarAndroid}>

                <NavigationBar title={titleConfig} rightButton={rightButtonConfig}
                leftButton={leftButtonConfig}/>
                </View>
                  <View style={[styles.line,{marginTop:10}]} />

                <View style={{marginTop:10}}>
                    <Text style={styles.detailsText}>{'Name:  '}{this.state.planet.data.name}</Text>
                    <View style={[styles.line,{marginTop:10}]} />
                    <Text  style={styles.detailsText}>{'Rotation Period:  '}{this.state.planet.data.rotation_period}</Text>
                    <View style={[styles.line,{marginTop:10}]} />
                    <Text  style={styles.detailsText}>{'Climate:  '}{this.state.planet.data.climate}</Text>
                    <View style={[styles.line,{marginTop:10}]} />
                    <Text  style={styles.detailsText}>{'Terrain:  '}{this.state.planet.data.terrain}</Text>
                    <View style={[styles.line,{marginTop:10}]} />
                    <Text style={styles.detailsText}>{'Population:  '}{this.state.planet.data.population}</Text>
                    <View style={[styles.line,{marginTop:10}]} />

                </View>
            </View>
        )
    }

}