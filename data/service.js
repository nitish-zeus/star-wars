import axios from 'axios'
import _ from 'lodash'
import {AsyncStorage} from "react-native";
import moment from 'moment'
let DataServices = {
    urlPrefix: 'https://',
    domain: 'swapi.co',
    apiPrefix: '/api/',
    StarwarsService: {
        people: async function () {
            let array = []
            let responseUrl = ''
            try {
                await axios
                    .get(`${DataServices.urlPrefix}${DataServices.domain}${DataServices.apiPrefix}people`)
                    .then((response) => {
                        array.push(response.data.results)
                        responseUrl = response.data.next
                    })
                while (responseUrl != null) {
                    let url = responseUrl
                    await axios
                        .get(url)
                        .then((res => {
                            array.push(res.data.results)
                            responseUrl = res.data.next
                        }))
                }
                array = _.flatten(array)
                await AsyncStorage.setItem("@SW:People", JSON.stringify(array));
                return true;
            } catch (e) {
                return false;
            }
        },
        getPeople: async function () {
            return await AsyncStorage.getItem("@SW:People");
        },
        doLogin: async function (username, password, array) {
            let logged = false
            let user = _.find(array, item => item.name === username)
            if (user != undefined) {
                password = _.find(array, item => item.birth_year === password)
                if (password != undefined) {
                    logged = true
                } else {
                    logged = false
                }
            } else {
                logged = false
            }
            return logged

        },
        planets: async function () {
            let array = []
            let responseUrl = ''
            try {
                await axios
                    .get(`${DataServices.urlPrefix}${DataServices.domain}${DataServices.apiPrefix}planets`)
                    .then((response) => {
                        array.push(response.data.results)
                        responseUrl = response.data.next
                    })
                while (responseUrl != null) {
                    let url = responseUrl
                    await axios
                        .get(url)
                        .then((res => {

                            array.push(res.data.results)
                            responseUrl = res.data.next
                        }))
                }
                array = _.flatten(array)
                sortedArray = _.orderBy(array, 'population', 'asc');
                await AsyncStorage.setItem("@SW:Planets", JSON.stringify(sortedArray));
                return true
            } catch (e) {
                return false
            }
        },
        getPlanets: async function () {
            return await AsyncStorage.getItem("@SW:Planets");
        },
        planetData: async function (url) {
            try {
                let planet = await axios.get(url)
                await AsyncStorage.setItem("@SW:Planet", JSON.stringify(planet));
                return true;
            } catch (e) {
                return false;
            }
        },
        getPlanetData: async function () {
            return await AsyncStorage.getItem("@SW:Planet");
        },
        clearPlanetData: async function () {
            await AsyncStorage.multiRemove(["@SW:Planet"])
        },

        clear: async function () {
            await AsyncStorage.multiRemove(["@SW:People", "@SW:Planet", "@SW:Planets","@SW:SearchValidTill"])
        },
        filterPlanets: async function (searchText, array) {
            let results = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].name.toLowerCase().indexOf(searchText.trim().toLowerCase()) != -1) {
                    results.push(array[i]);
                }
            }
            return results;
        },
        searchValidity: async function () {
            try{
            await AsyncStorage.setItem("@SW:SearchValidTill", JSON.stringify(moment(new Date()).add(1, "minutes").toDate()));
            return true;
            }catch(e){
                return false;
            }
        },
        isSearchValid: async function () {
            let bool = true
            let searchValidity = await AsyncStorage.getItem("@SW:SearchValidTill");
            if (moment(new Date).add(0, "minutes").toDate().valueOf() < moment(JSON.parse(searchValidity)).add(0, "minutes").toDate().valueOf()) {
                bool = true
            } else {
                bool = false
            }
            return bool;
        }
    }
}
module.exports = DataServices