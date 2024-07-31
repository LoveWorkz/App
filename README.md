This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Loveworkz docs

## Collections (C)
Need to remove these collections:
- Categories_2
- Questions

## (C) Challenge_Categories
This is header tab "Challenges" page.

## (C) Rubrics
This is list in "Topics" page

## (C) levels
This is cards in "Sessions" page

## (C) quadrants
4 main groups in "Session" page: Personal Growth, Friendship, Communication & Conflict and Shared Meaning.

## (C) wild_questions

## FILES

All_16.xlsx - All questions list
Menu_2.xlsx - tranlation
NewBuild.xlsx          - challenge sequences
Core_Challenges_6.xlsx - challenge questions

## Links

### Figma
```
https://www.figma.com/design/qLAOghgJXKLroTNtnG6KP1/LoveWorkz-WORK-FILE?node-id=1065-6551&t=1cdbEUz1qwZdqjI4-0
```

### Google admMob -
```
https://admob.google.com/home/
```

### APP STORE CONNECT -
```
https://appstoreconnect.apple.com/apps/6463159843/distribution/ios/version/inflight
```

### Apple developer account -
```
https://developer.apple.com/account
```

### Google play console -
```
https://play.google.com/console/u/0/developers/5737397304435905704/app-list
```

### google cloud platform
```
TODO
```
## Commands
### . For getting APK file -
```
cd ./android && ./gradlew clean && cd ../
cd ./android && ./gradlew assembleRelease && cd ../
```

### install iOS dependencies -
```
cd ios/ && pod install && cd ..
```

### Notes

- if iOS not working you can delete iOS/Podfile.lock, iOS/pods, also clean build inside Xcode and then run the command cd ios/ && pod install && cd ..

# Getting Started
# Original React-native docs.

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
