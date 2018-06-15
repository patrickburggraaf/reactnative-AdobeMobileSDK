/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Button from 'react-native-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppState,
  NativeModules
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

let AdobeMobile = NativeModules.ADBReact;

export default class App extends Component {
  constructor(){
    super();

        this.state = {
            appState: AppState.currentState,
            uuid: null
        }

        this.getUUID().then((uuid) => {
            this.setState({uuid});
        });
  }
    
    getUUID() {
        return new Promise((resolve, reject) => {
            AdobeMobile.getUUID((error, uuid) => {
                if (error) {
                    console.log("Got error when trying to get Mobile UUID from Native side");
                    reject(error);
                } else {
                    resolve(uuid[0]);
                }
            });
        });
    }    

  sendTrackAction(action){
    if(AdobeMobile){
      AdobeMobile.trackAction(action, {page: "home-page", buttonLabel: "Analytic-Action", "deviceUUID": this.state.uuid});      
      //AdobeMobile.getIdentfier(identifier => {
      //    console.log("Mobile identifier" +identifier);
      //});
        
    }
  }

  sendTrackState(page){
    if(AdobeMobile){
      AdobeMobile.trackState(page, {speed: "120", buttonLabel: "Analytic-Action"});        
    }
  }
    
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState});
    
    if(AdobeMobile){
      AdobeMobile.trackState("[App] Home", {"state":nextAppState, "deviceUUID": this.state.uuid});

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <Text style={styles.instructions}>
            Mobile UUID: {this.state.uuid}
        </Text>        

        <Button
        containerStyle={{padding:10, height:45, width:200, overflow:'hidden', borderRadius:4,margin:10, backgroundColor: 'gray'}}
        disabledContainerStyle={{backgroundColor: 'black'}}
        style={{fontSize: 16, color: 'white'}}
        onPress={() => this.sendTrackAction('view-page')}>
            Adobe Track Action
        </Button>
    <Button
        containerStyle={{padding:10, height:45, width:200, overflow:'hidden', borderRadius:4,margin:10, backgroundColor: 'gray'}}
        disabledContainerStyle={{backgroundColor: 'black'}}
        style={{fontSize: 16, color: 'white'}}
        onPress={() => this.sendTrackState('[App] Callbackexample')}>
            Adobe Calback Action
        </Button>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
