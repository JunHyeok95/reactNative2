import React, {useContext, useState, useEffect} from 'react';
import {Platform, Linking, Alert} from 'react-native';
import Styled from 'styled-components/native';
import {UserContext} from '~/Contexts/User/index';
import {StackNavigationProp} from '@react-navigation/stack';
import {Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '~/Components/Button';
import Input from '~/Components/Input';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import URLInput from './URLInput';
import {useTranslation} from 'react-i18next';

const TouchableWithoutFeedback = Styled.TouchableWithoutFeedback``;
const Container = Styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #EFEFEF;
  justify-content: center;
  align-items: center;
`;
const View = Styled.View`
  width: 100%;
  align-items: center;
`;
const TextRowView = Styled.View`
  flex-direction: row;
`;
const TextRowViewTouchableOpacity = Styled.TouchableOpacity`
  flex-direction: row;
`;
const KrumamoText = Styled.Text`
  font-size: 66px;
  color: #000000;
  font-weight: bold;
`;
const Ri9Text = Styled.Text`
  font-size: 66px;
  color: #FF0000;
  font-weight: bold;
`;
const KrumamoTextEn = Styled.Text`
  font-size: 40px;
  color: #000000;
  font-weight: bold;
`;
const Ri9TextEn = Styled.Text`
  font-size: 40px;
  color: #FF0000;
  font-weight: bold;
`;
const FormContainer = Styled.View`
  width: 80%;
  height: 200px;
  justify-content: center;
  align-items: center;
`;
const ButtonContainer = Styled.View`
  flex: 1;
  flex-direction: row;
`;
const TouchableOpacityView = Styled.View`
`;
const TouchableOpacity = Styled.TouchableOpacity`
  margin: 1px;
  padding: 8px;
  border: 1px;
`;
const TouchableOpacityViewRow = Styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
const TouchableOpacity2 = Styled.TouchableOpacity`
  flex: 1;
  margin: 1px;
  padding: 8px;
  border: 1px;
  justify-content: center;
`;

const TouchableOpacity3 = Styled.TouchableOpacity`
  flex:1;
`;
const Label = Styled.Text`
  font-size: 16px;
  text-align: center;
  color: #000000;
`;
const TopLeftView = Styled.View`
  position: absolute;
  top: 4px;
  left: 4px;
  right: 54px;
`;
const TopRighView = Styled.View`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 50px;
  height: 50px;
`;

type NavigationProp = StackNavigationProp<LoginStackNaviParamList, 'SignIn'>;

interface Props {
  navigation: NavigationProp;
}

const SignIn = ({navigation}: Props) => {
  const {URL, updateURL, login, login2} = useContext<IUserContext>(UserContext);
  const [inputEmail, setInputEamil] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showMaster, setShowMaster] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const {t} = useTranslation();

  const [touch, setTouch] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <View>
          <TextRowView>
            <TextRowViewTouchableOpacity onPress={() => setTouch(!touch)}>
              {touch == true ? (
                <>
                  <KrumamoText>{t('kurumamo')}</KrumamoText>
                  <Ri9Text>{t('ri9')}</Ri9Text>
                </>
              ) : (
                <>
                  <KrumamoTextEn>KURUMAMORI</KrumamoTextEn>
                  <Ri9TextEn>119</Ri9TextEn>
                </>
              )}
            </TextRowViewTouchableOpacity>
          </TextRowView>
          <Icon
            style={{margin: 36}}
            name="account-circle"
            color={'#002EFF'}
            size={200}
          />
          <FormContainer>
            <Input
              style={{flex: 1, backgorunColr: '#F00', marginBottom: 8}}
              placeholder={t('email')}
              keyboardType={'email-address'}
              onChangeText={(e) => setInputEamil(e)}
            />
            <Input
              style={{marginBottom: 8}}
              secureTextEntry={true}
              placeholder={t('password')}
              onChangeText={(e) => setInputPassword(e)}
            />
            <Button
              // label="Sign In"
              style={{backgroundColor: '#DDDDDD', marginBottom: 8}}
              label={t('singin')}
              onPress={() => {
                if (inputEmail.trim() && inputPassword.trim()) {
                  let inputE = inputEmail.trim();
                  let inputP = inputPassword.trim();
                  login2(inputE, inputP);
                } else {
                  Alert.alert(t('incorrectlyentered'));
                }
              }}
            />
            <ButtonContainer>
              <Button
                style={{backgroundColor: '#DDDDDD'}}
                label={t('singup')}
                onPress={() => Linking.openURL(URL + '/auth/register')}
              />
            </ButtonContainer>
          </FormContainer>
        </View>
        {showMaster && (
          <TopLeftView style={{marginTop: getStatusBarHeight()}}>
            <TouchableOpacityView>
              <TouchableOpacity onPress={() => setShowInput(true)}>
                <Label>URL : {URL}</Label>
              </TouchableOpacity>
              <TouchableOpacityViewRow>
                <TouchableOpacity2 onPress={() => login('WDJ@YJU', 'password')}>
                  <Label>MASTER</Label>
                </TouchableOpacity2>
                <TouchableOpacity2
                  onPress={() => updateURL('http://kurumamori.iptime.org:80')}>
                  <Label>reset URL{'\n'}kuru:80</Label>
                </TouchableOpacity2>
                <TouchableOpacity2
                  onPress={() =>
                    updateURL('http://kurumamori.iptime.org:8080')
                  }>
                  <Label>reset URL{'\n'}kuru:8080</Label>
                </TouchableOpacity2>
              </TouchableOpacityViewRow>
            </TouchableOpacityView>
          </TopLeftView>
        )}
        <TopRighView style={{marginTop: getStatusBarHeight()}}>
          <TouchableOpacity3 onPress={() => setShowMaster(!showMaster)} />
        </TopRighView>
        {showInput && <URLInput hideURLInput={() => setShowInput(false)} />}
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
