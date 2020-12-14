import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class MyRecievedBookScreen extends Component{
    constructor(){
        super();
        this.state={
            userid:firebase.auth().currentUser.email,recievedBooksList:''
        }
        this.requestRef =null;
    }
   getRecievedBooklist=() =>{
   this.requestRef = db.collection('requested_book').where('user_id','==',this.state.userid)
   .onSnapshot((snpashot)=>{
       var Bl = snpashot.docs.map((doc)=>doc.data())
       this.setState({
           recievedBooksList:Bl
       })
   })
   }
  componentDidMount(){
      this.getRecievedBooklist();
  }
  componentWillUnmount(){
      this.requestRef
  }
 keyExtractor = (item,index)=>index.toString();
renderItem=({item,i})=>{
 return(
     <ListItem
     key={i}
     title={item.book_name}
     subtitle={item.book_status}
     titleStyle={{color:'black',fontWeight:'bold'}}
     bottomDivider
     />
 )
}
render(){
    return(
        <View>
            <MyHeader title="recieved Books" navigation={this.props.navigation} />
            <View style={{flex:1}}>
             {
                 this.state.recievedBooksList.length ===0
                 ?(
                     <View style={styles.subContainer}> 
                         <Text style={{fontSize:20}}>list of all recieved books</Text>
                     </View>
                 ):(
                     <FlatList
                     keyExtractor={this.keyExtractor}
                     data={this.state.recievedBooksList}
                     renderItem={this.renderItem}
                     />
                 )
             }
            </View> 
        </View>
    )
}

}
const styles = StyleSheet.create({
     subContainer:{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' },
      button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000"}, 
      shadowOffset: { width: 0, height: 8 }})