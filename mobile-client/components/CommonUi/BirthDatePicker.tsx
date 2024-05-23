import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, Button, Platform, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native-gesture-handler'

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
        <View className="flex mt-2 ">
            <TouchableOpacity
                onPress={() => {
                    setShowPicker(true)
                }}
                className="bg-[#3b366c] w-full h-8 rounded-md"
            >
                <Text className="text-white m-auto">BirthDate</Text>
            </TouchableOpacity>
            {showPicker && <DateTimePicker value={props.value} mode="date" display="spinner" onChange={onChange} />}
        </View>
    )
}
