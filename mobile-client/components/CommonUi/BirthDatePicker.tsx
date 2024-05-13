import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, Button, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

interface IDatePickerProps {
    value: Date
    setDate: Dispatch<SetStateAction<any>>
}

export const DatePickerComponent: React.FC<IDatePickerProps> = props => {
    const [showPicker, setShowPicker] = useState(false)
    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || props.value
        setShowPicker(Platform.OS === 'ios')
        props.setDate(currentDate)
    }

    return (
        <View className="flex items-start mt-2  ">
            <Button onPress={() =>{setShowPicker(true)}} title="Show Date Picker" />
            {showPicker && <DateTimePicker value={props.value} mode="date" display="spinner" onChange={onChange}  />}
        </View>
    )
}
