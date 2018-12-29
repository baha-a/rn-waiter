// React native and others libraries imports
import React, { Component } from 'react';
import { Keyboard,InteractionManager, ActivityIndicator } from 'react-native';
import Drawer from 'react-native-drawer';


// Our custom files and classes import
import SideMenu from './SideMenu';

export default class SideMenuDrawer extends Component {
  constructor(props){
    super(props);
    this.state={
      
      isReady:true,
    }
  }

  componentDidMount(){
      InteractionManager.runAfterInteractions( ()=> this.setState({isReady:true}));
  }

  render() {
    if(this.state.isReady==false)
      return;
    
    return(
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={<SideMenu />}
        tapToClose={true}
        type="overlay"
        openDrawerOffset={0.3}
        onCloseStart={() => Keyboard.dismiss()}
        >
          {this.props.children}
      </Drawer>
    );
  }

  close() {
    this._drawer.close();
  }

  open() {
    this._drawer.open();
  }
}
