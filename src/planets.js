import React from 'react';
import {
    Text,
    Image,
    View,
    KeyboardAvoidingView,
    Dimensions,
    ImageBackground,
    TextInput,
    FlatList,
    TouchableOpacity,
    Button,
    Platform
} from 'react-native';
import styles from "../assets/styles";
import NavigationBar from 'react-native-navbar';
import DataServices from '../data/service'
import PulseLoader from "../components/PulseLoader";
const backgroundImage = require("../assets/images/bg.png");
const {height, width} = Dimensions.get('window');

export default class Planets extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            planets: [],
            loading: false,
            user:this.props.navigation.state.params.user,
            counter:0,
            filteresResults:[]
        }
    }

    async componentWillMount() {
        this.setState({loading: true})
        let planetsArr = await DataServices
            .StarwarsService
            .getPlanets()
        if (planetsArr == null) {
            let planets = await DataServices
                .StarwarsService
                .planets()
            if (planets) {
                planetsArr = await DataServices
                    .StarwarsService
                    .getPlanets()
                if (planetsArr != null) {
                    this.setState({
                        planets: JSON.parse(planetsArr),
                       
                    })
                }
                this.setState({
                    planets: JSON.parse(planetsArr),
                    loading: false

                })
            }
        } else {
            this.setState({
                planets: JSON.parse(planetsArr),
                loading: false
            })
        }
    }
    rowPressed(data){
        this
        .props
        .navigation
        .navigate('PlanetDetail', {
            user: this.state.username,
           url:data.url
        })
    }
    _keyExtractor = (item, index) => index;
    renderSeparator = () => {
    return (<View style={styles.line} />);
};
async searchFunc(search){{
    this.setState({
        searchText:search
    })
        let planetsArr = await DataServices
        .StarwarsService
        .getPlanets()
        this.setState({
            planets: JSON.parse(planetsArr)
        })
    
}

}

    // renderRow(data) {
    //     return(
    //         <View style={styles.listContainer}>
    //         <View style={{height:100,justifyContent:'center'}}>
    //                 <TouchableOpacity onPress={() => this.rowPressed(data.item)}>
    //                 <Text style={{marginTop:2,marginLeft:10}}>{'Name'}    {data.item.name}</Text>
    //                 <Text style={{marginTop:5,marginLeft:10}}>{'Population'} {data.item.population}</Text>
    //                 </TouchableOpacity>
    //                 </View>  
    //                 <View style={styles.line}/>    
    //                    </View>              
    //     )
    // }
    _keyExtractor = (item, index) => index;
    renderSeparator = () => {
    return (<View />);
};
async logout(){
    await DataServices.StarwarsService.clear()
    this.props.navigation.navigate('Login')
    
}
async onSearch(){
    if(this.state.searchText != ''){
    if(this.state.user == 'Luke Skywalker' && this.state.counter == 0){
    let valid =  await DataServices.StarwarsService.searchValidity()
    let results = await DataServices.StarwarsService.filterPlanets(this.state.searchText,this.state.planets)
    this.setState({
    counter :this.state.counter + 1
    })
    if(results != null){
     this.setState({
        planets:results
     })
 }
    }else if(this.state.user == 'Luke Skywalker' && this.state.counter > 0){
        this.setState({
            counter :this.state.counter + 1
        })
       let validity =  await DataServices.StarwarsService.isSearchValid() 
       if(validity && this.state.counter < 15){
        let results = await DataServices.StarwarsService.filterPlanets(this.state.searchText,this.state.planets)
        if(results != null){
            this.setState({
                planets:results
            })
        }
       }else if(!validity && this.state.counter >= 15){
           this.setState({
               counter:0
           })
       }
       
       else{
        alert('Maximum  number of search for the user is 15 in a minute')
       }
    }else{
        let results = await DataServices.StarwarsService.filterPlanets(this.state.searchText,this.state.planets)
        if(results != null){
            this.setState({
                planets:results
            })
        }
    }
}
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

        const titleConfig = {
            title: 'Planets'
        };
        return (
            <View style={styles.container}>
                        <View 
                        style={Platform.OS =='ios'? styles.navigationBariOS : styles.navigationBarAndroid}>

                <NavigationBar title={titleConfig} rightButton={rightButtonConfig}/>
                </View>
                <View style={styles.line} />
                <View style={{flexDirection:'row',justifyContent:'space-between',width:width}} >
                    <TextInput
                     underlineColorAndroid={'transparent'}
                    placeholder={'Search Planets'}
                        style={{
                        height: 40,
                        borderColor: 'gray',
                        borderBottomWidth: 0.5,
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'black',
                        marginLeft:10,
                        width:width*0.75,
                       
                        
                    }}
                        onChangeText={(searchText) => this.searchFunc(searchText)}
                        value={this.state.searchText}/>
                        <View style={{marginTop:10,left:-5}}>
                        <Button
                        style={{alignItems:'center'}}
                         onPress={()=> this.onSearch()}
                         title="Search"
                         color="#841584"/>
                         </View>
                </View>
                <View style={[styles.line,{marginTop:10}]} />
                {this.state.planets.length == 0 && <View style={styles.noDataView}>
                    <Text>
                         No Planets Found
                </Text>

                </View>}
                <View>
                    < FlatList
                    keyExtractor = {
                        this._keyExtractor
                    }
                    data = {
                        this.state.planets
                    }
                    renderItem = {
                        ({item,index}) => (
                            <View style={styles.listContainer}>
                                <View
                                    style={{
                                    height: 100,
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => this.rowPressed(item)}>
                                        <Text
                                            style= {index < 3 ? {
                                                marginTop: 2,
                                                marginLeft: 10,
                                                fontSize:20
                                            }:{
                                                marginTop: 2,
                                                marginLeft: 10,
                                                fontSize:12
                                            }}>{'Name:  '} {item.name}</Text>
                                        <Text
                                            style={{
                                            marginTop: 5,
                                            marginLeft: 10
                                        }}>{'Population:  '} {item.population}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.line}/>
                            </View>
                        )
                    }
                    />


                </View>
            </View>
        )
    }

}