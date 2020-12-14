import React, {Component} from 'react';
import {Text,View,StyleSheet,TextInput, Alert,TouchableOpacity} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase'
export default class SettingScreen extends Component{
 constructor(){
     super();
     this.state={
         firstName:'',LastName:'',contact:'',emailId:'',address:'',docId:''
     }
 }
 getUserDetails=()=>{
 var email = firebase.auth().currentUser.email;
 
 db.collection('users').where('email_id','==',email).get()
 .then(snapshot=>{
 snapshot.forEach(doc=>{
     var data = doc.data()
     this.setState({
         emailId:data.email_id,
         firstName:data.first_name,
         LastName:data.last_name,
         address:data.address,
         contact:data.contact,
         docId:doc.id})
 })
 })
 } 

 
 
 
 componentDidMount(){
     this.getUserDetails();
 }
 updateUserdetails=()=>{
     db.collection('users').doc(this.state.docId)
     .update({
         'first_name':this.state.firstName,
         'last_name':this.state.LastName,
         'contact':this.state.contact,
         'address':this.state.address
     })
     return Alert.alert('Profile Updated Succesfully!')
 }
render(){

    return(
        <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation}/>
        <View style={styles.formContainer}>
            <TextInput
            placeholder="first name"
            maxLength={10}
            style={styles.formTextInput}
            onChangeText={(text)=>{this.setState({firstName:text})}}
            value={this.state.firstName}
            />
              <TextInput
            placeholder="Last name"
            maxLength={8}
            style={styles.formTextInput}
            onChangeText={(text)=>{this.setState({LastName:text})}}
            value={this.state.LastName}
            />
               <TextInput
            placeholder="Email Id"
    
            keyboardType={'email-address'}
            style={styles.formTextInput}
            onChangeText={(text)=>{this.setState({emailId:text})}}
            value={this.state.emailId}
            />
               
              <TextInput
            placeholder="Adress"
            multiline={true}
            style={styles.formTextInput}
            onChangeText={(text)=>{this.setState({address:text})}}
            value={this.state.address}
            />
              <TextInput
            placeholder="Contact"
            maxLength={10}
            keyboardType={'numeric'}
            style={styles.formTextInput}
            onChangeText={(text)=>{this.setState({contact:text})}}
            value={this.state.contact}
            />
            <TouchableOpacity onPress={()=>{this.updateUserdetails()}} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
           
            </View>
          
        </View>
    )
}


}
const styles = StyleSheet.create({ container : { flex:1, alignItems: 'center', justifyContent: 'center' }, formContainer:{ flex:1, width:'100%', alignItems: 'center' }, formTextInput:{ width:"75%", height:35, alignSelf:'center', borderColor:'#ffab91', borderRadius:10, borderWidth:1, marginTop:20, padding:10, }, button:{ width:"75%", height:50, justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop:20 }, buttonText:{ fontSize:25, fontWeight:"bold", color:"#fff" } })






