# clean
```
cd ios
xcodebuild clean
rm -rf ios/build
rm -rf ios/Pods

cd android
./gradlew clean
rm -rf android/build
rm -rf android/app/build
rm -rf android/.gradle

rm -rf node_modules
watchman watch-del-all

cd ios && pod install && cd ..
```

## install typescript // tsconfig.json 생성
npm i -D typescript @types/react @types/react-native

## install styled-components
npm i -S styled-components
npm i -D @types/styled-components

## install babel-plugin-root-import // babel.config.js 수정 tsconfig.json 수정
npm i -D babel-plugin-root-import

## install react-native-tts // typescript error ...
npm i -S react-native-tts react-native-speech
npm install @react-native-community/slider --save

## install react-native-device-info
npm i -S react-native-device-info

## install react-native-voice
npm i -S @react-native-community/voice
npx pod-install

## install react-native-mail
npm i -S react-native-mail

## Multi-Language 
yarn add react-native-localize
yarn add i18n-js
yarn add lodash.memoize // 무슨 .. 캐시? 에 사용한다는데 ...
npm i -S @types/i18n-js
npm i -S react-native-languages

## Multi-Language 2
npm i -S react-i18next i18next