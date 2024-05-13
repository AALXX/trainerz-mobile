## TrainerTemplate Component

The `TrainerTemplate` component is used to display the profile of a trainer. It renders different sections of the trainer's profile based on the user's interaction.

### Props

- **AccountType**: Type of the account, indicating whether the user is a trainer.
- **BirthDate**: Date of birth of the trainer.
- **Description**: Description or bio of the trainer.
- **LocationCity**: City where the trainer is located.
- **LocationCountry**: Country where the trainer is located.
- **Sport**: Sport in which the trainer specializes.
- **UserEmail**: Email address of the trainer.
- **UserName**: Name of the trainer.
- **UserVisibility**: Visibility settings of the trainer's profile.
- **UserPublicToken**: Public token associated with the trainer's account.
- **AccountPrice**: Price associated with the trainer's services.

### Usage

```tsx
<TrainerTemplate
    AccountType={userData.AccountType}
    BirthDate={userData.BirthDate}
    Description={userData.Description}
    LocationCity={userData.LocationCity}
    LocationCountry={userData.LocationCountry}
    Sport={userData.Sport}
    UserEmail={userData.UserEmail}
    UserName={userData.UserName}
    UserVisibility={userData.UserVisibility}
    UserPublicToken={userData.UserPublicToken}
    AccountPrice={userData.AccountPrice}
/>