## AthleteTemplate Component

The `AthleteTemplate` component provides a template for displaying an athlete's profile, including their videos and personal information, in a React Native application.

### Props

- **UserName**: *(required)* A string representing the athlete's name.
- **UserPublicToken**: *(required)* A string representing the athlete's public token.
- **Description**: *(optional)* A string representing the athlete's profile description.
- **UserEmail**: *(optional)* A string representing the athlete's email.
- **UserVisibility**: *(optional)* A string representing the visibility status of the athlete's profile.
- **AccountType**: *(optional)* A string representing the type of the athlete's account.
- **Sport**: *(optional)* A string representing the athlete's sport.

### Usage

```tsx
<AthleteTemplate 
    UserName={userName} 
    UserPublicToken={userPublicToken} 
    Description={description} 
    UserEmail={userEmail} 
    UserVisibility={userVisibility} 
    AccountType={accountType} 
    Sport={sport} 
/>