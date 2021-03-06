import React, {useContext, useState} from 'react';
import Styled from 'styled-components/native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {UserContext} from '~/Contexts/User/index';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {useTranslation} from 'react-i18next';

const TouchableOpacity = Styled.TouchableOpacity``;
const Header = Styled.View`
  border-bottom-width: 1px;
  border-color: #D3D3D3;
  align-items: center;
  justify-content: center;
`;
const Text = Styled.Text`
  margin: 8px;
  font-size: 32px;
`;
const Footer = Styled.View`
  border-top-width: 1px;
  border-color: #D3D3D3;
`;
const Middle = Styled.View`
`;

interface Props {
  props: DrawerContentComponentProps<DrawerContentOptions>;
}

const Drawer = ({props}: Props) => {
  const {userInfo2, logout} = useContext<IUserContext>(UserContext);
  const [visible, setVisible] = useState(true);
  const {t} = useTranslation();

  return (
    <>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <Header>
            {visible ? (
              <Text>
                {userInfo2 != undefined &&
                userInfo2.name != null &&
                userInfo2.name != undefined
                  ? userInfo2.name + ''
                  : ''}
              </Text>
            ) : (
              <Text>
                {userInfo2 != undefined &&
                userInfo2.key != null &&
                userInfo2.key != undefined &&
                userInfo2.key != -1
                  ? userInfo2.key
                  : 'key'}
              </Text>
            )}
          </Header>
        </TouchableOpacity>
        <DrawerItemList {...props} />
        <Footer>
          <DrawerItem
            icon={({}) => (
              <Icon
                style={{margin: 0, padding: 0}}
                name="logout"
                color={'#000000'}
                size={24}
              />
            )}
            label={t('singout')}
            onPress={() => {
              console.log('> Drawer logout');
              logout();
            }}
          />
        </Footer>
      </DrawerContentScrollView>
    </>
  );
};

export default Drawer;
