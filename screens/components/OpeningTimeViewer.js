import React, {useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment-timezone';
import { firestoreDB } from '../FirebaseDB';
images = {
    tri : require("../../assets/icons/Tri1.png"),
};
const dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const col2 = '#fbfbfb';
const SplitTimes = (Times) => {
    const parts = Times.split("-");
    OpenTime = parts[0];
    CloseTime = parts[1];
    const parts2 = OpenTime.split(":");
    OpenHour = parts2[0];
    OpenMin = parts2[1];
    const parts3 = CloseTime.split(":");
    CloseHour = parts3[0];
    CloseMin = parts3[1];
    return [OpenHour,OpenMin,CloseHour,CloseMin];
};
const TimeToHourMinutes = (time) =>{
    const parts2 = time.split(":");
    hour = parts2[0];
    min = parts2[1];
    return [hour,min];
};
export const isOpen = ({restaurant,day,time}) =>{
    if(restaurant.OpeningHours[day] == '-'){
        return false;
    }
    parts = SplitTimes(restaurant.OpeningHours[day]);
    OpenHour = parts[0];
    OpenMin = parts[1];
    CloseHour = parts[2];
    CloseMin = parts[3];
    parts2 = TimeToHourMinutes(time);
    TimeHour = parts2[0];
    TimeMin = parts2[1];
    return (parseInt(TimeHour) > parseInt(OpenHour) && parseInt(TimeHour) < parseInt(CloseHour)) || 
            (parseInt(TimeHour) == parseInt(OpenHour) && parseInt(TimeMin) < parseInt(CloseMin));
};
const MergeTimes = ({times1,times2,is1}) => {
    const parts1 = times1.split("-");
    const parts2 = times2.split("-");
    return is1 ? `${parts1[0]}-${parts2[1]}` : `${parts1[1]}-${parts2[0]}`;
};
const ChangeTimes = ({times1,time,is1}) => {
    const parts1 = times1.split("-");
    return is1 ? `${parts1[0]}-${time}` : `${time}-${parts1[1]}`;
};
const OpeningTimes = ({restaurant,isEditable}) => {
    dayidx = new Date().getDay();
    const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
    CurrentTime = `${hours}:${minutes}`;
    const [isExtended, ExtendMain] = useState(isEditable);

    const [selectedDay, setCurrentDay] = useState(0);
    const [, forceUpdate] = useState();

    const [isOpenTimePickerVisible, setTimeOpenPickerVisibility] = useState(false);
    const [isCloseTimePickerVisible, setTimeClosePickerVisibility] = useState(false);

    const [selectedOpenTime, setSelectedOpenTime] = useState('12:00');
    const [selectedCloseTime, setSelectedCloseTime] = useState('12:00');
    const showOpenTimePicker = (day) => {
        setCurrentDay(day);
        setTimeOpenPickerVisibility(true);
    };
    const showCloseTimePicker = (day) => {
        setCurrentDay(day);
        setTimeClosePickerVisibility(true);
    };
    const hideTimeOpenPicker = () => {
        setTimeOpenPickerVisibility(false);
    };
    const hideTimeClosePicker = () => {
        setTimeClosePickerVisibility(false);
    };
    const handleOpenConfirm = (time) => {
        const localTime = moment(time).tz(moment.tz.guess()).format('HH:mm');
        restaurant.OpeningHours[selectedDay] = ChangeTimes({times1: restaurant.OpeningHours[selectedDay],time: localTime,is1: false});
        setSelectedOpenTime(localTime);
        hideTimeOpenPicker();
        firestoreDB().UpdateRestaurantContent(restaurant);
    };
    const handleCloseConfirm = (time) => {
        const localTime = moment(time).tz(moment.tz.guess()).format('HH:mm');
        restaurant.OpeningHours[selectedDay] = ChangeTimes({times1: restaurant.OpeningHours[selectedDay],time: localTime,is1: true});
        setSelectedCloseTime(localTime);
        hideTimeClosePicker();
        firestoreDB().UpdateRestaurantContent(restaurant);
    };
    const CloseRestaurant = (day) => {
        if(restaurant.OpeningHours[day] == '-'){
            restaurant.OpeningHours[day] = `${selectedOpenTime}-${selectedCloseTime}`;
        }
        else{
            restaurant.OpeningHours[day] = '-';
        }
        firestoreDB().UpdateRestaurantContent(restaurant);
        forceUpdate(Math.random());
    };
    const DayData = ({day,isEditable, oh}) =>{
        const [isExtendedOpen, setisExtendedOpen] = useState(false);
        const [isRestaurantOpen, setOpenRestaurnt] = useState(oh[day] == '-' ? "Closed" : "Open")
        
        if(isEditable){
            if(!isExtendedOpen){
                return (
                    <TouchableOpacity disabled={!isEditable} onPress={()=>setisExtendedOpen(true)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',marginLeft:5}}>
                        <Text style={{fontSize:16,flex:1,fontWeight: (day == dayidx) ? 'bold' : 'regular'}}> {dayArray[day]}: {oh[day] == '-' ? "Closed" : oh[day]}</Text>
                        <Image source={images.tri}
                                style={{...styles.icon,alignSelf: 'flex-end',transform: [{rotate: isExtendedOpen ? '0deg' : '180deg' }]}}
                                resizeMode="center"/>
                    </TouchableOpacity>
                );
            }
            else{
                return (
                    <View>
                        <TouchableOpacity disabled={!isEditable} onPress={()=>setisExtendedOpen(false)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',marginLeft:5}}>
                            <Text style={{fontSize:16,flex:1,fontWeight: (day == dayidx) ? 'bold' : 'regular'}}> {dayArray[day]}: {oh[day] == '-' ? "Closed" : oh[day]}</Text>
                            <Image source={images.tri}
                                    style={{...styles.icon,alignSelf: 'flex-end',transform: [{rotate: isExtendedOpen ? '0deg' : '180deg' }]}}
                                    resizeMode="center"/>
                        </TouchableOpacity>
                        <View style={{marginLeft:5,padding:3}}>
                            <TouchableOpacity disabled={!isEditable} onPress={()=>CloseRestaurant(day)}>
                                <Text style={{fontSize:14,padding:1}}>{oh[day] == '-' ? "Open Restaurant" : "Close Restaurant"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={!isEditable} onPress={()=>showOpenTimePicker(day)}>
                                <Text style={{fontSize:14,padding:1}}>Set Opening time</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={!isEditable} onPress={()=>showCloseTimePicker(day)}>
                                <Text style={{fontSize:14,padding:1}}>Set Closing time</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
        }
        else{
            //console.log(`${dayArray[day]}: ${oh[day] == '-' ? "Closed" : oh[day]}`,(day == dayidx));
            return (
                <Text style={{fontSize:16,marginLeft:5,fontWeight: (day == dayidx) ? 'bold' : 'regular'}}> {dayArray[day]}: {oh[day] == '-' ? "Closed" : oh[day]}</Text>
            );
        }
    };

    if(isExtended){
        if(isEditable){
            return(
                <View style={{...styles.item,padding:5}}>
                    {dayArray.map((day, index) => (
                        <DayData key={index} day={index} isEditable={isEditable} oh={restaurant.OpeningHours} />
                    ))}
                    <DateTimePickerModal
                        isVisible={isOpenTimePickerVisible}
                        mode="time"
                        onConfirm={handleOpenConfirm}
                        onCancel={hideTimeOpenPicker}
                    />
                    <DateTimePickerModal
                        isVisible={isCloseTimePickerVisible}
                        mode="time"
                        onConfirm={handleCloseConfirm}
                        onCancel={hideTimeClosePicker}
                        
                    />
                </View>
            );
        }
        else{

            return (
                <View style={{ ...styles.item, padding: 5, justifyContent: 'center' }}>
                    
                    {dayArray.map((day, index) => (
                        <DayData key={index} day={index} isEditable={isEditable} oh={restaurant.OpeningHours} />
                    ))}
                    
                    <View style={{ position: 'absolute', top:5,right: 5, alignSelf: 'center' }}>
                        <TouchableOpacity onPress={()=>ExtendMain(false)}>
                        <Image 
                            source={images.tri}
                            style={{ ...styles.iconBeeg, transform: [{ rotate: isExtended ? '0deg' : '180deg' }] }}
                            resizeMode="center"
                        />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
    else{
        isClosedToday = restaurant.OpeningHours[dayidx] == '-';
        isClosedNow = !isOpen({restaurant:restaurant,day:dayidx,time:CurrentTime});
        return(
            <TouchableOpacity onPress={()=>ExtendMain(true)} style={{...styles.item,padding:5,flexDirection: 'row', alignItems: 'center', justifyContent: 'left',marginLeft:3}}>
                <Text style={{fontSize:16,marginLeft:5,flex:1,color: isClosedToday || isClosedNow ? '#8a1b00' : '#078a00'}}>{isClosedToday ? "Closed today" : (isClosedNow ? "Closed now" : "Open")}</Text>
                <Image source={images.tri}
                        style={{...styles.icon,alignSelf: 'flex-end',transform: [{rotate: isExtended ? '0deg' : '180deg' }]}}
                        resizeMode="center"/>
            </TouchableOpacity>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        backgroundColor: col2,
        borderRadius: 15,
    },
    icon: {
        width: 13,
        height: 15,
        
    },
    iconBeeg: {
        width: 16,
        height: 20,
        
    },
});
export default OpeningTimes;