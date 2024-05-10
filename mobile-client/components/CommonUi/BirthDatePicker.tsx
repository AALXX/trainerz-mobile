import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, Button, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

interface IDatePickerProps {
    value: Date
    setDate: Dispatch<SetStateAction<Date>>
}

export const DatePickerComponent: React.FC<IDatePickerProps> = props => {
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)

    const togglePicker = () => {
        setShowPicker(!showPicker)
    }

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || date
        setShowPicker(Platform.OS === 'ios')
        setDate(currentDate)
    }

    return (
        <View className="flex items-start mt-2  ">
            <DateTimePicker
                testID="dateTimePicker"
                value={props.value}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={e => {
                    onChange
                }}
            />
        </View>
    )
}
