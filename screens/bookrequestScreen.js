import React, {Component} from 'react';
import {Text, View,TouchableOpacity,StyleSheet,TextInput,Alert,KeyboardAvoidingView } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { ScrollView } from 'react-native-gesture-handler';


export default class BookRequestScreen  extends Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            bookName:'',reasonToRequest:'',isBookRequestActive:'',
            requestBookName:'',requestid:'',userDocid:'',docid:'',
            bookStatus:'',
        }
    }
    getBookRequest=()=>{
       var bookRequest = db.collection("requested_book").where('user_id','==',this.state.userId).get()
       .then((snapshot)=>{
         snapshot.forEach(doc=>{
           if(doc.data().book_status !== "recieved"){
              this.setState({
               requestid:doc.data().request_id,
               requestBookName:doc.data().book_name,
               bookStatus:doc.data().book_status,
               docid:doc.id
              })
           }
         })
       })
    }
    updateBookRequestStatus=()=>{
     db.collection('requested_books').doc(this.state.docid).update({
       book_status:'recieved',
     })
     db.collection('users').where('email_id','==',this.state.userId).get()
     .then(snapshot=>{
       snapshot.forEach(doc=>{
          db.collection('users').doc(doc.id).update({
            isBookRequestActive:false
          })
       })
     })
    }
    sendNotification=()=>{
       db.collection('users').where('email_id','==',this.state.userId).get()
       .then(snapshot=>{
         snapshot.forEach(doc=>{
           var name = doc.data().first_name;
           var lastname = doc.data().last_name;
         })
       })
       db.collection('all_notifications').where('request_id','==',this.state.requestid).get()
       .then(snapshot=>{
         snapshot.forEach(doc=>{
           var donorId = doc.data().donor_id;
           var bookName = doc.data().book_name;
         })
       })
       db.collection("all_notifications").add({
         "targeted_user_id":donorId,
         "message": name + ""+lastname + " recieved the book" + bookName,
         "notification_status":"unread",
         "book_name":bookName
       })
    }

  getIsBookRequestActive(){
     db.collection('user').where('email_id','==',this.state.userId)
     .onSnapshot(querySnapshot=>{
       querySnapshot.forEach(doc=>{
         this.setState({
           isBookRequestActive:doc.data().isBookRequestActive,
           userDocid:doc.id
         })
       })
     })
  }
  

  addRequest = async (bookName,reasonToRequest)=>{
  var userId = this.state.userId;
  var randomRequestId = this.createUniqueId()
  db.collection('requested_books').add({
    "user_id": userId,
    "book_name":bookName,
    "reason_to_request":reasonToRequest,
    "request_id"  : randomRequestId,
     
  })
   await this.getBookRequest()
  db.collection('users').where('email_id','==',userId).get()
   .then()
   .then((snapshot)=>{
     snapshot.forEach(doc=>{
       db.collection('users').doc(doc.id).update({
         isBookRequest:true
       })
     })
   })



  this.setState({reasonToRequest:'',bookName:''})
  return Alert.alert("book requested successfully!")
  }  
  createUniqueId(){
      return Math.random().toString(36).substring(7)
  }
render(){
          if(this.state.isBookRequestActive === true){
            return(
              <View style={{justifyContent:'center',flex:1}}>
                <View style={{borderColor:'orange',justifyContent:'center',alignItems:'center',borderWidth:2,margin:10,padding:10}}>

                <Text>Book Name</Text>
                <Text>{this.state.requestBookName}</Text>
                </View>
                <View style={{borderColor:'orange',justifyContent:'center',alignItems:'center',borderWidth:2,margin:10,padding:10}}>
                  <Text>{this.state.bookStatus}</Text>
                </View>
                <TouchableOpacity style={{borderColor:'orange',borderWidth:1,width:300,alignSelf:'center',height:30,alignItems:'center',marginTop:30}}
                onPress={()=>{this.sendNotification()
                this.updateBookRequestStatus()
                this.recievedBook(this.state.requestBookName)
                }}
                >
                  <Text>I recieved the book</Text>
                </TouchableOpacity>
              </View>
            )
          }else{
            
      
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation={this.props.navigation}/>
          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}    }
const styles = StyleSheet.create({ keyBoardStyle : { flex:1, alignItems:'center', justifyContent:'center' }, formTextInput:{ width:"75%", height:35, alignSelf:'center', borderColor:'#ffab91', borderRadius:10, borderWidth:1, marginTop:20, padding:10, }, button:{ width:"75%", height:50, justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop:20 }, } )