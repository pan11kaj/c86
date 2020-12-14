import React,{Component} from 'react';
import {View,Text,TouchableOpacity,StyleSheet } from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import db from '../config'
export default class CustomSideBarMenu extends Component{
    constructor(){
        super();
        this.state={
        image:'',userId:firebase.auth().currentUser.email,name:'',docId:""
        }
    }
  selcetPicture= async()=>{
   const {cancled,uri} = await ImagePicker.launchImageLibraryAsync({
     mediaTypes:ImagePicker.MediaTypeOptions.All,
     allowsEditing:true,
     aspect:[4,3]
     ,quality:1
   })
   if(!cancled){
       this.uploadImage(uri,this.state.userId)
       this.setState({
           image:uri
       })
   }
  }
  uploadImage=async(uri,imageName)=>{
   var response = await fetch(uri)
   var blob = await response.blob
   var ref = firebase
   .storage()
   .ref()
   .child("user_profiles/"+imageName);
   return ref.put(blob).then((response)=>{
       this.fetchImage(imageName)
   })
  }
  componentDidMount(){
      this.fetchImage(this.state.userid);
      this.getUserProfile()
  }
  fetchImage=(imageName)=>{
  var storageref = firebase
  .storage()
  .ref()
  .child("user_profiles/"+imageName);
  storageref
  .getDownloadURL()
  .then((url)=>{
      this.setState({
          image:url
      })
  })
  .catch((error)=>{
      this.setState({
          image:'#'
      })
  })
  }
  getUserProfile(){
    db.collection('users').where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot=>{
        querySnapshot.forEach(doc=>{
            this.setState({
                name:doc.data().first_name+''+doc.data().last_name
            })
        })
    })
  }

    render(){
        
        return(
            <View style={styles.container}>
                <View style={{backgroundColor:'orange',alignItems:'center',flex:0.1,marginTop:30}}>
              <Avatar
              rounded
              source={{
                  uri:this.state.image
              }}
               size="xlarge" 
               onPress={()=>this.selcetPicture()}
               containerStyle={styles.imageContainer}
               showEditButton
              />     
               <Text style={{fontSize:20,fontWeight:'100',paddingTop:10}}>{this.state.name}</Text>
                </View>
                <View style={styles.DrawerItemsContainer}>
                
             <DrawerItems
           {...this.props}      
        />
        </View>
       
        <View style={styles.logOutContainer}> 
        <TouchableOpacity style={styles.logOutButton} onPress={()=>{
            this.props.navigation.navigate('WelcomeScreen')
            firebase.auth().signOut()
        }}><Text>Log Out</Text></TouchableOpacity>
        </View>
  
        
            </View>
        )
    }
}
var styles = StyleSheet.create({ container : { flex:1 }, drawerItemsContainer:{ flex:0.8 }, logOutContainer : { flex:0.2, justifyContent:'flex-end', paddingBottom:30 }, logOutButton : { height:30, width:'100%', justifyContent:'center', padding:10 }, logOutText:{ fontSize: 30, fontWeight:'bold' } })