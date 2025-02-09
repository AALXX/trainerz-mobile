import { Dispatch, SetStateAction } from 'react'

export interface IUserData {
    UserName: string
    Description: string
    BirthDate: Date
    LocationCountry: string
    LocationCity: string
    Sport: string
    UserEmail: string
    PhoneNumber: string
    UserVisibility: string
    AccountType: string
    UserPublicToken: string
    Rating?: number
    AccountPrice?: number
}

export interface IProfileCards {
    Title: string
    TabName: string
    setComponentToShow: Dispatch<SetStateAction<string>>
}
