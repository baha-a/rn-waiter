/**
* example of usage:
*   var left = (<Left><Button transparent><Icon name='menu' /></Button></Left>);
*   var right = (<Right><Button transparent><Icon name='menu' /></Button></Right>);
*   <Navbar left={left} right={right} title="My Navbar" />
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Header, Body, Title, Left, Right, Icon } from 'native-base';
import { InteractionManager } from 'react-native';

// Our custom files and classes import
import Colors from '../Colors';

export default class Navbar extends Component {
  constructor(props){
    super(props);
    this.state={
      isReady:true
    };
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => { this.setState({isReady:true}) });
  }

  render() {
    if(this.state.isReady==false){
      return(
      <Header
        style={{ backgroundColor: Colors.navbarBackgroundColor }}  
        backgroundColor={Colors.navbarBackgroundColor}
        androidStatusBarColor={Colors.statusBarColor}
        noShadow={true}>

        </Header>
        );
    }
    return(
      <Header
        style={{ backgroundColor: Colors.navbarBackgroundColor }}
          
        backgroundColor={Colors.navbarBackgroundColor}
        androidStatusBarColor={Colors.statusBarColor}
        noShadow={true}
        >
        
        {this.props.left ? this.props.left : <Left style={{flex: 0}} />}
        <Body style={styles.body}>
          <Title style={styles.title}>{this.props.title}</Title>
        </Body>
        {this.props.right ? this.props.right : <Right style={{flex: 0}} />}
      </Header>
    );
  }
}

const styles={
    body: {
    flex:1,
    justifyContent: 'center',  
    alignItems: 'center'      
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '100'
  }
};
