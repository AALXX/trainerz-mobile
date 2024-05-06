import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, Button, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

interface IDatePickerProps {
    value: Date
    setDate: Dispatch<SetStateAction<Date>>
}

export const DatePickerComponent: React.FC<IDatePickerProps> = props => {


    return (
        <View className='flex items-start mt-2  '>
            <DateTimePicker    testID="dateTimePicker" value={props.value} mode="date" is24Hour={true} display="default" onChange={e => {props.setDate(new Date(e.nativeEvent.timestamp as number))}} />
        </View>
    )
}
