import React,{Component} from 'react';
import { Dimensions } from 'react-native';
import {View,Text} from 'react-native';
import {ListItem,Icon} from 'react-native-elements';
import {SwipeListview} from 'react-native-swipe-list-view';
import db from '../config'
export default class SwipeAble extends Component{
constructor(props){
    super(props)
        this.state={
            allNotifications:this.props.allNotifications
        }

}
updateMarkAsRead=(notification)=>{
db.collection("all_notifications").doc(notification.doc_id).update({
    notification_status:'read'
})
}

onSwipeValueChange=(swipedata)=>{
var allNotifications = this.state.allNotification;
const {key,value} = swipedata;
if(value<Dimensions.get("window").width){
const newData = [...allNotifications]
const prevIndex = allNotifications.findIndex(index=>{item.key === key});
this.updateMarkAsRead(allNotifications[prevIndex]);
newData.splice(prevIndex,1);
this.setState({
    allNotifications:newData,
})
}
}

renderItem=data=>{
    <ListItem
    leftElement={<Icon name="book" type="font-awesome" color="#696969"/>}
    title={data.item.book_name}
    titleStyle={{color:'black',fontWeight:'bold'}}
    subtitle={data.item.message}
    bottomDivider
    />
}
renderHiddenItem=()=>{
    return(
        <View style={styles.rowBack}><View style={[styles.backRightBtn,styles.backRightBtnRight]}>
            <Text style={styles.backTextWhite}>
            
            </Text></View></View>
    )
}

render(){
    return(
        <View style={styles.container}>
           <SwipeListview
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get('window').width}
            preViewRowKey={'0'}
            preViewOpenValue={'-40'}
            preViewOpenDelay={'3000'}
            onSwipeValueChange={this.onSwipeValueChange}
           />
        </View>
    )
}

}





