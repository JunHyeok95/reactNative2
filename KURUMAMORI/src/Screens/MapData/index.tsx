import React, {useContext, useState, useEffect} from 'react';
import Styled from 'styled-components/native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import IconButton from '~/Components/IconButton';
import {Platform, Modal, PermissionsAndroid} from 'react-native';
import {DrivingDataContext} from '~/Contexts/DrivingData';
import {UserContext} from '~/Contexts/User/index';
import Geolocation from 'react-native-geolocation-service';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ReactInterval from 'react-interval';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import Sound from 'react-native-sound';
import Tts from './TTS';

const soundList = [
  {
    title: 'alert119', // 0
    isRequire: true,
    url: require('~/Assets/Sound/alert119.mp3'),
  },
  {
    title: 'singo119',
    isRequire: true,
    url: require('~/Assets/Sound/singo119.mp3'),
  },
];

// update -----------------------------------------
const TopLeftView = Styled.View`
  position: absolute;
  background-color: #FFFFFFDD;
  border-color: #00F;
  border-width: 2px;
  border-radius: 16px;
  top: 1%;
  left: 2%;
  padding: 2%;
`;
const TopLeftViewTouch = Styled.TouchableOpacity`
  flex: 1;
`;
const TopLeftViewBasic = Styled.View`
  flex-direction: row;
`;
const TopLeftViewLeft = Styled.View`
`;
const TopLeftViewRight = Styled.View`
`;
const TopLeftViewLeftText = Styled.Text`
  font-weight: bold;
  text-align: right;
  font-size: 20px;
  padding-left: 2%;
`;
const TopLeftViewRightText = Styled.Text`
  text-align: center;
  font-size: 20px;
  padding-left: 2%;
  padding-right: 2%;
`;
const TextColor = Styled.Text`
  color: #00000088;
`;

// update -----------------------------------------
const TopRightView = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 25px;
  border-width: 1px;
  border-color: #AAA;
  top: 1%;
  right: 2%;
  width: 50px;
  height: 50px;
`;

const CenterRightView = Styled.View`
  position: absolute;
  right: 2%;
  top: 46%;
  width: 50px;
  height: 12%;
`;
const CenterTestTestRightView = Styled.View`
position: absolute;
  right: 2%;
  top: 20%;
  width: 50px;
  height: 6%;
`;
const CenterTestRightView = Styled.View`
  position: absolute;
  right: 2%;
  top: 30%;
  width: 50px;
  height: 12%;
`;
const CenterTestTestTestRightView = Styled.View`
  position: absolute;
  right: 2%;
  top: 62%;
  width: 50px;
  height: 12%;
`;
const BottomLeftViewGPS = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 25px;
  border-width: 1px;
  border-color: #AAA;
  bottom: 2%;
  left: 2%;
  width: 50px;
  height: 50px;
`;
const BottomLeftViewEye = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 25px;
  border-width: 1px;
  border-color: #AAA;
  bottom: 2%;
  left: 4%;
  margin-left: 50px;
  width: 50px;
  height: 50px;
`;
const BottomRightView = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 10px;
  border-width: 2px;
  border-color: #AAA;
  bottom: 2%;
  right: 2%;
  width: 100px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;
const Btn = Styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const BtLabel = Styled.Text`
  font-size: 22px;
  font-weight: 900;
`;

const SingoTextView = Styled.View`
  width: 90%;
  padding-top: 16px;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;
const SingoText = Styled.Text`
  font-size: 28px;
`;
const SingoTextCount = Styled.Text`
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 50px;
  color: #FF0000;
`;
const LottieViewMyView = Styled.View`
  width: 100%;
  height: 40%;
  padding: 100px;
`;
const ModalView = Styled.View`
  background-color: #FFFFFF;
  width: 96%;
  margin-top: 30%;
  margin-left: 2%;
  margin-right: 2%;
  border-width: 8px;
  border-radius: 8px;
  border-color: #FF0000;
  justify-content: center;
  align-items: center;
`;
const TouchableOpacity = Styled.TouchableOpacity`
  align-items: center;
`;
const TouchableOpacityView = Styled.View`
  background-color: #FFFFFF;
  justify-content: center;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  border-width: 3px;
  border-color: #FF0000;
  border-radius: 10px;
`;
const ReportCancelBtn = Styled.Text`
  font-size: 40px;
  text-align: center;
  font-weight: 900;
  background-color: #FF0000;
  color: #FFFFFF;
  padding: 5px;
`;

// ------------- sleep modal ------------
const SleepModalView = Styled.View`
  flex: 1;
  width: 70%;
  margin-left: 15%;
  justify-content: center;
  align-items: center;
`;
const SleepModalImageTextView = Styled.View`
  padding: 16px;
  background-color: #FFFFFF;
  border-width: 8px;
  border-radius: 8px;
  border-color: #FF0000;
  align-items: center;
`;
const SleepAlertImage = Styled.Image`
`;
const SleepAlertText = Styled.Text`
  margin-top: 8px;
  font-size: 32px;
  font-weight: 900;
`;
// ------------- sleep modal ------------
// ------------- start, save modal ------------
const ModalViewBack = Styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000055;
`;
const DrivingStartSaveModalView = Styled.View`
  background-color: #FFFFFF;
  width: 72%;
  height: 51%;
  margin-top: 45%;
  margin-left: 14%;
  margin-right: 14%;
  border-width: 4px;
  border-radius: 32px;
  justify-content: center;
  align-items: center;
  `;
const LottieStartSaveView = Styled.View`
  width: 100%;
  height: 40%;
  padding: 100px;
`;
const DrivingStartSaveTextView = Styled.View`
  width: 100%;
  padding-top: 16px;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;
const DrivingStartSaveText = Styled.Text`
  font-size: 32px;
  font-weight: bold;
`;

// ------------- start, save modal ------------
// ------------- report_ok modal ------------
const ReportOkModalView = Styled.View`
  background-color: #FFFFFF;
  width: 96%;
  margin-top: 30%;
  margin-left: 2%;
  margin-right: 2%;

  border-width: 8px;
  border-radius: 8px;
  border-color: #FF0000;

  justify-content: center;
  align-items: center;
`;
const ReportOKImage = Styled.Image`
  width: 100%;
  height: 100%;
`;
const ReportOKText = Styled.Text`
  font-size: 48px;
  font-weight: 800;
`;
const ReportOKText2 = Styled.Text`
  margin-top: 8px;
  font-size: 28px;
  font-weight: 600;
`;
const ReportOKText3 = Styled.Text`
  margin-top: 24px;
  font-size: 36px;
  font-weight: 800;
`;
const ReportTouchableOpacity = Styled.TouchableOpacity`
  width: 100%;
  height: 55%;
`;

// ------------- report_ok modal ------------
interface IGeolocation {
  latitude: number;
  longitude: number;
}

interface ICoordinate {
  latitude: number;
  longitude: number;
  speed: number | null;
  timestamp: any;
}

interface ILatLng {
  latitude: number;
  longitude: number;
}

interface ICamera {
  center: ILatLng;
  heading: number;
  pitch: number;
  zoom: number;
  altitude: number;
}
interface ILocation {
  latitude: number;
  longitude: number;
  bool_report: boolean;
  bool_sudden_acceleration: boolean;
  bool_sudden_stop: boolean;
  bool_sleep: boolean;
  timestamp: number;
}

type TypeDrawerProp = DrawerNavigationProp<DrawNaviParamList, 'MainTabNavi'>;
interface DrawerProp {
  navigation: TypeDrawerProp;
}

const MapData = ({navigation}: DrawerProp) => {
  const {t, i18n} = useTranslation();

  // 안드로이드 위치권한 요청
  const androidPermissionLocation = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((result) => {
        // check
        if (result) {
          console.log('android LOCATION check OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then((result) => {
            // request
            if (result) {
              console.log('android LOCATION request Ok');
            } else {
              console.log('android LOCATION reject');
            }
          });
        }
      });
    } else if (Platform.OS === 'ios') {
      // Alert.alert('PermissionLocation, Android only');
    }
  };

  const face = (num: number): string => {
    if (num == 0) return ' ';
    if (num == 10) return t('front');
    if (num == 20) return t('left');
    if (num == 30) return t('right');
    return '';
  };
  const eyePoint = (num: number): string => {
    if (num == 0) return 'X';
    if (num == 1) return 'On';
    if (num == 2) return 'Off';
    return '';
  };

  const {
    drivingSaveData,
    setDrivingSaveData,
    drivingStart,
    drivingMarkerSave,
    drivingSave,
    linkInfo,
    setLinkInfo,
    defaultInfo,
    setDefaultInfo,
    checkInfo,
    setCheckInfo,
  } = useContext(DrivingDataContext);

  const {userInfo2} = useContext<IUserContext>(UserContext);

  const [marginTop, setMarginTop] = useState<number>(1);
  const [infoTouch, setInfoTouch] = useState<boolean>(false);

  const [linkInfo_4Cnt, setLinkInfo_4Cnt] = useState<number>(0);
  const [linkInfo_5Cnt, setLinkInfo_5Cnt] = useState<number>(0);

  const [onSave, setOnSave] = useState<boolean>(false);
  const [onPolyline, setOnPolyline] = useState<boolean>(false);
  const [onMarker, setOnMarker] = useState<boolean>(false);
  const [driving, setDriving] = useState<boolean>(false);

  // MapMarker Point
  const [_startTime, _setStartTime] = useState<number>(0);
  const [_endTime, _setEndTime] = useState<number>();
  // MapMarker Point

  const [coordinate, setCoordinate] = useState<ICoordinate>({
    latitude: 0.0,
    longitude: 0.0,
    speed: 0.0,
    timestamp: 0,
    // Milliseconds since Unix epoch ㄴㄴㄴ
  });
  const [coordinate2, setCoordinate2] = useState<ICoordinate>({
    latitude: 0.0,
    longitude: 0.0,
    speed: 0.0,
    timestamp: 0, // Milliseconds since Unix epoch
  });

  const [camera, setCamera] = useState<ICamera>({
    center: {
      latitude: 35.896311,
      longitude: 128.622051,
    },
    heading: 0,
    pitch: 0,
    zoom: 15,
    altitude: 0,
  });

  const [hidden, setHidden] = useState<boolean>(false);
  const [locations, setLocations] = useState<Array<IGeolocation>>([]);
  // 사고감지 locations
  const [markerLocations, setMarkerLocations] = useState<
    Array<IMarkerlocation>
  >([]);

  const [modalVisibleSleep, setModalVisibleSleep] = useState(false);
  const [modalVisibleReportCount, setModalVisibleReportCount] = useState(false);

  const [modalVisibleStart, setModalVisibleStart] = useState(false);
  const [modalVisibleSave, setModalVisibleSave] = useState(false);

  const [modalVisibleReportOk, setModalVisibleReportOk] = useState(false);

  const [alert119, setAlert119] = useState(
    new Sound(soundList[0].url, (error) => {}),
  );
  const [singo119, setSingo119] = useState(
    new Sound(soundList[1].url, (error) => {}),
  );

  const [interPlus, setInterPlus] = useState<boolean>(false);
  const [interMinus, setInterMinus] = useState<boolean>(false);
  const [pushNum, setPushNum] = useState<number>(0);

  const myTts = (speak: string) => {
    console.log('myTts');
    let _lang = i18n.language;
    if (Platform.OS === 'ios') {
      let _iosVoiceId;
      if (_lang == 'en') {
        // lang == 'en-US'
        _iosVoiceId = 'com.apple.ttsbundle.Samantha-compact';
      }
      if (_lang == 'kr') {
        // lang == 'ko-KR'
        _iosVoiceId = 'com.apple.ttsbundle.Yuna-compact';
      }
      if (_lang == 'jp') {
        // lang == 'ja-JP'
        _iosVoiceId = 'com.apple.ttsbundle.Kyoko-compact';
      }
      if (_iosVoiceId != undefined) {
        Tts.stop(); // 클리어
        Tts.speak(speak, {
          iosVoiceId: _iosVoiceId,
          rate: 0.5,
        });
      }
    }
  };

  useEffect(() => {
    androidPermissionLocation();
    Tts.addEventListener('tts-start', (event: any) => {});
    Tts.addEventListener('tts-finish', (event: any) => {});
    Tts.addEventListener('tts-cancel', (event: any) => {});

    // //## 지워야함
    // setCheckInfo([-1,-1,-1, 1 ,-1,-1,-1,-1,-1,-1,-1]);
    // ## 지워야함
    // setLinkInfo([-1,-1,-1, 151, 10, 1,-1, 0, 0,-1]);
    console.log('--- --- MapData Mount');
    return () => {
      console.log('--- --- MapData return');
    };
  }, []);

  // 도탈 체크 ...
  let linkInfo_ = (): void => {
    // console.log(checkInfo);
    // console.log(linkInfo);
    if (driving) {
      // 운전상태 체크

      if (checkInfo[11] == 11 && checkInfo[3] == 1) {
        let _checkInfo = [...checkInfo];
        _checkInfo[4] += 1; // 신고접수 온
        console.log('신고 접수 카운트', checkInfo[4]);
        setCheckInfo(_checkInfo);
        if (checkInfo[3] == 1 && checkInfo[4] == 0) {
          // Tts reportrequest 사고감지.. 취소버튼을 눌러라
          myTts(t('reportrequest'));
        }
        // 카운트 모달 열기
        setModalVisibleReportCount(true);
      }

      // 전화중이다 애니메이션, 사고상태 클리어
      // 신고접수상태 클리어, 모달창 다 닫기
      if (checkInfo[4] >= 10) {
        let _checkInfo = [...checkInfo];
        console.log('신고 접수 카운팅 완료 !!', checkInfo[4]);
        console.log(_checkInfo[4]);
        _checkInfo[3] = 0; // 신고접수상태 클리어
        _checkInfo[4] = 0;
        _checkInfo[5] = 1; // 신고완료상태 시작
        setCheckInfo(_checkInfo);

        // 카운트 모달 닫기
        setModalVisibleReportCount(false);

        // 구급차 모달 열기
        // if(checkInfo[5] == 1){ 이걸 여기 흡수
        console.log('신고 접수 완료 !! 음성 송출');
        // 신고음성, 신고 전화중 모달 5~10초
        setTimeout(() => {
          // Tts reporting 자동 신고 중 알림
          myTts(t('reporting'));
          setTimeout(() => {
            setModalVisibleReportOk(true);
            setTimeout(() => {
              setModalVisibleReportOk(false);
              // Tts reportOKtext3 신고 완료
              setTimeout(() => {
                setModalVisibleSave(true);
                myTts(t('reportstopdriving'));
                console.log('자동 신고로 인해 운전이 중지됬습니다.');
                setTimeout(() => {
                  setModalVisibleSave(false);
                }, 5000);
              }, 1000);
            }, 14000);
            // 신고음성
            if (singo119) {
              // Tts reportOKtext3 신고 완료
              setTimeout(() => {
                myTts(t('reportOK'));
              }, 2000);
              singo119.play();
            }
          }, 2000);
        }, 2000);

        let _checkInfo2 = [...checkInfo];
        console.log(_checkInfo2);
        _checkInfo2[0] = 0; // 운전 종료
        _checkInfo2[1] = 1; // 운전 종료
        _checkInfo2[2] = 0; // 사고상태 클리어
        _checkInfo2[3] = 0; // 신고 접수상태 클리어
        _checkInfo2[4] = 0; // 신고 카운터 클리어
        _checkInfo2[5] = 0; // 신고 완료상태 클리어
        _checkInfo2[6] = 0; // 클리어
        _checkInfo2[7] = 0; // 클리어
        _checkInfo2[8] = 0; // 클리어
        _checkInfo2[9] = 0; // 클리어
        setCheckInfo(_checkInfo2);
        setLinkInfo([-1, -1, -1, -1, -1, -1, -1, 0, 0, -1]);
        console.log(_checkInfo2);

        let reportCheckId = false;
        if (onSave && userInfo2 && userInfo2.key) {
          if (userInfo2.key != -1 && userInfo2.key != undefined) {
            if (userInfo2.key >= 3) {
              reportCheckId = true;
            }
          }
        }
        let {latitude, longitude, timestamp} = coordinate2;
        let _markerLocation = {
          latitude,
          longitude,
          bool_report: reportCheckId,
          bool_sudden_acceleration: false,
          bool_sudden_stop: false,
          bool_sleep: false,
          timestamp, // 이건 앱에서만 활용함
        };
        console.log(_markerLocation);
        console.log(markerLocations.length);
        // 마커를 기록함
        setMarkerLocations([...markerLocations, _markerLocation]);
        if (onSave && userInfo2 && userInfo2.key) {
          if (userInfo2.key != -1 && userInfo2.key != undefined) {
            // 유저가 있으므로 마커를 웹으로 전송함
            console.log(_markerLocation);
            drivingMarkerSave(_markerLocation);
          }
        }

        let _drivingSaveData = Object.assign({}, drivingSaveData);
        let _endT = new Date().getTime();
        _setEndTime(() => _endT);
        // console.log(locations);

        if (locations) {
          if (userInfo2 && userInfo2.key) {
            _drivingSaveData.webUserId = userInfo2.key;
          }
          if (userInfo2 && userInfo2.name) {
            _drivingSaveData.Drivingline = locations;
            _drivingSaveData.name = userInfo2.name;
            _drivingSaveData.startTime = _startTime;
            _drivingSaveData.endTime = _endT;
          }
          if (markerLocations != undefined) {
            if (markerLocations.length > 1) {
              console.log('저장한다 마크마크');
              _drivingSaveData.DrivingMarker = markerLocations;
            }
          }
          if (_drivingSaveData.endTime && _drivingSaveData.startTime) {
            if (_drivingSaveData.endTime - _drivingSaveData.startTime > 500) {
              console.log('운전을 기록합니다');
              drivingSave(_drivingSaveData); // 운전 종료 로직 4번으로 씀
            }
          }
        }

        // 메인페이지 운전중 체크
        let _defaultInfo = [...defaultInfo];
        _defaultInfo[4] = 0;
        setDefaultInfo(_defaultInfo);
        // 메인페이지 운전중 체크

        setDrivingSaveData(undefined);
        setLocations([]); // 초기화
        setMarkerLocations([]);
        setDriving(false); // 운전
        setOnSave(false); // 기록
        console.log('!!!!!!!!!!!!!!!! 운전 종료했다 !!!!!!!!!!!!!!!!!!!!!');
      }
      // 카운트 10 이상 시
      // 신고 완료 상태 활성화 (운전 종료, 각종 클리어, 신고한다는 음성, 모달창 닫기)
    }

    // 신고 카운터가 꽉 차서 신고가 갔음
    if (checkInfo[5] == 1) {
      console.log('check Info 5가 1입니다');
    }
  };

  let linkInfo_0 = (): void => {
    if (driving) {
      // 운전상태 체크
      if (linkInfo[0] == 119 && checkInfo[3] != 1 && checkInfo[10] != 119) {
        // 신고접수 상태 체크
        // 신고버튼 on상태, 신고접수 off상태, 이전신고버튼적용 no상태
        let _checkInfo = [...checkInfo];

        // 온과 동시에 카운트가 올라가고 신고접수, 버튼이 소모됨
        _checkInfo[2] = 1; // 사고상태 온
        _checkInfo[3] = 1; // 신고접수 온
        _checkInfo[10] = 119; // 신고 버튼 1회성 소모
        _checkInfo[11] = 11;
        setCheckInfo(_checkInfo);
      }

      if (linkInfo[0] == 77 && checkInfo[3] == 1) {
        // 신고버튼 상태 체크
        // 취소버튼 on상태, 신고접수 on상태, 사고상태 on상태
        let _checkInfo = [...checkInfo];

        if (_checkInfo[3] != 0) {
          // Tts reportcancel 신고취소 알림
          myTts(t('reportcancel'));
        }

        _checkInfo[2] = 0; // 사고상태 오프
        _checkInfo[3] = 0; // 신고접수 오프
        _checkInfo[4] = 0; // 신고 카운터 클리어
        _checkInfo[10] = 0; // 신고 버튼 1회성 리셋
        _checkInfo[11] = 11;
        setCheckInfo(_checkInfo);
      }
      // 신고접수상태를 보고 카운터를 토탈체크에서 올리자
    }
  };

  let linkInfo_3 = (): void => {
    if (driving) {
      // 운전상태 체크
      if (checkInfo[2] != 1) {
        // 사고 상태 체크
        if (linkInfo[3] != -1 && linkInfo[3] != 0) {
          // 가울기 링크값이 들어오고있는지 체크
          if (!(50 <= linkInfo[3] && linkInfo[3] <= 150)) {
            // 기울어젔는지 체크
            console.log('기울기 사고');
            // 사고 접수
            let _checkInfo = [...checkInfo];
            _checkInfo[2] = 1;
            _checkInfo[3] = 1;
            setCheckInfo(_checkInfo);
          }
        }
      }
    }
  };

  let linkInfo_4 = (): void => {
    if (driving) {
      // 운전상태 체크
      // if(checkInfo[9] != 1){ // 주시태만 상태 체크
      if (linkInfo[4] != -1) {
        // 값이 들어오고 있는지 체크
        if (linkInfo[4] == 30 || linkInfo[4] == 20) {
          setLinkInfo_4Cnt((linkInfo_4Cnt) => {
            return linkInfo_4Cnt + 1;
          });
          console.log('태만 체크', linkInfo_4Cnt);
          if (linkInfo_4Cnt > 6) {
            // 태만 클리어
            setLinkInfo_4Cnt(0);

            // Tts sensedfocus 운전하는 데 집중하십시오 / 태만 감지 사운드
            myTts(t('sensedfocus'));
          }
        } else if (linkInfo[4] == 10) {
          // 정면주시 보상
          console.log('정면 성공 체크', linkInfo_4Cnt);
          if (linkInfo_4Cnt > 1) {
            setLinkInfo_4Cnt((linkInfo_4Cnt) => {
              return (linkInfo_4Cnt -= 2);
            });
          }
          if (linkInfo_4Cnt < 0) {
            setLinkInfo_4Cnt((linkInfo_4Cnt) => {
              return (linkInfo_4Cnt = 0);
            });
          }
        } else {
        } //
      } // 링크
      // } // 주시
    } // 운전
  };

  let linkInfo_5 = (): void => {
    if (driving) {
      // 운전상태 체크
      // if(checkInfo[8] != 1){ // 졸음 상태 체크
      if (linkInfo[5] != -1) {
        // 눈 값이 들어오고 있는지 체크
        if (linkInfo[5] == 2) {
          // 눈을 감고있는지 체크
          setLinkInfo_5Cnt((linkInfo_5Cnt) => {
            return linkInfo_5Cnt + 1;
          });
          console.log('>> 졸음 체크', linkInfo_5Cnt);
          if (linkInfo_5Cnt > 6) {
            // 졸음 클리어
            setLinkInfo_5Cnt(0);

            // 졸음감지 경고음
            if (alert119) {
              alert119.play();
            }

            setModalVisibleSleep(true);
            setTimeout(() => {
              setModalVisibleSleep(false);
            }, 3000);

            let {latitude, longitude, timestamp} = coordinate2;
            let _markerLocation = {
              latitude,
              longitude,
              bool_report: false,
              bool_sudden_acceleration: false,
              bool_sudden_stop: false,
              bool_sleep: true,
              timestamp, // 이건 앱에서만 활용함
            };
            console.log(_markerLocation);
            console.log(markerLocations.length);
            // 마커를 기록함
            setMarkerLocations([...markerLocations, _markerLocation]);
            if (onSave && userInfo2 && userInfo2.key) {
              if (userInfo2.key != -1 && userInfo2.key != undefined) {
                // 유저가 있으므로 마커를 웹으로 전송함
                console.log(_markerLocation);
                drivingMarkerSave(_markerLocation);
              }
            }
          }
        } else if (linkInfo[5] == 1) {
          // 눈뜸 보상
          console.log('>> 눈뜸 체크', linkInfo_5Cnt);
          if (linkInfo_5Cnt > 1) {
            setLinkInfo_5Cnt((linkInfo_5Cnt) => {
              return (linkInfo_5Cnt -= 2);
            });
          }
          if (linkInfo_5Cnt < 0) {
            setLinkInfo_5Cnt((linkInfo_5Cnt) => {
              return (linkInfo_5Cnt = 0);
            });
          }
        } else {
          // console.log(" 11 아니고 22 아닌 상황");
        }
      }
      // }
    }
  };

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1, marginTop}}
        loadingEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={true}
        camera={camera}
        onUserLocationChange={(e) => {
          if (onSave) {
            const {latitude, longitude} = e.nativeEvent.coordinate;
            setLocations([...locations, {latitude, longitude}]);

            setCoordinate2({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              speed: e.nativeEvent.coordinate.speed,
              // timestamp: e.nativeEvent.coordinate.timestamp,
              timestamp: new Date(),
            });

            setCamera((camera) => {
              return {
                center: {
                  latitude: latitude,
                  longitude: longitude,
                },
                heading: 0,
                pitch: 0,
                zoom: camera.zoom,
                altitude: 0,
              };
            });
          }
        }}>
        {onSave && onPolyline && (
          <Polyline
            coordinates={locations}
            strokeWidth={3}
            strokeColor="#00F"
          />
        )}

        {onSave &&
          onMarker &&
          markerLocations.map((markerLocation: ILocation, index: number) => (
            <Marker
              key={`markerLocation-${index}`}
              coordinate={{
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }}
              pinColor={
                markerLocation.bool_sudden_acceleration == true
                  ? 'blue'
                  : markerLocation.bool_sudden_stop == true
                  ? 'green'
                  : 'red'
              }
              title={
                markerLocation.bool_sudden_acceleration == true
                  ? t('suddenacceleration')
                  : markerLocation.bool_sudden_stop == true
                  ? t('suddenstop')
                  : t('dozeoff')
              }
              description={markerLocation.timestamp.toString()}
            />
          ))}
      </MapView>

      <ReactInterval
        timeout={1000}
        enabled={driving}
        callback={() => {
          linkInfo_();
          linkInfo_0();
          linkInfo_3();
          linkInfo_4();
          linkInfo_5();
        }}
      />

      {interPlus && (
        <ReactInterval
          timeout={30}
          enabled={interPlus}
          callback={() => {
            // console.log('급가속', pushNum);
            if (pushNum < 80) setPushNum(pushNum + 2);
          }}
        />
      )}

      {interMinus && (
        <ReactInterval
          timeout={30}
          enabled={interMinus}
          callback={() => {
            // console.log('급정거', pushNum);
            if (pushNum > 20) setPushNum(pushNum - 2);
          }}
        />
      )}

      {driving && (
        <TopLeftView style={{marginTop: getStatusBarHeight()}}>
          <TopLeftViewTouch
            onPress={() => {
              setInfoTouch(!infoTouch);
              if (infoTouch) setHidden(true);
              if (infoTouch && hidden) setHidden(false);
            }}>
            <TopLeftViewBasic>
              <TopLeftViewLeft>
                <TopLeftViewLeftText>{t('speed')} :</TopLeftViewLeftText>
                <TopLeftViewLeftText>{t('drivingtime')} :</TopLeftViewLeftText>
                <TopLeftViewLeftText style={{marginTop: 8}}>
                  {t('looking')} :
                </TopLeftViewLeftText>
                <TopLeftViewLeftText>{t('state')} :</TopLeftViewLeftText>

                {/* TopLeftViewDetail TopLeftViewDetail TopLeftViewDetail */}

                {infoTouch == true ? (
                  <>
                    <TopLeftViewLeftText style={{marginTop: 8}}>
                      S L R :
                    </TopLeftViewLeftText>
                    <TopLeftViewLeftText>Y P R :</TopLeftViewLeftText>
                    <TopLeftViewLeftText>{t('latitude')} :</TopLeftViewLeftText>
                    <TopLeftViewLeftText>
                      {t('longitude')} :
                    </TopLeftViewLeftText>
                    <TopLeftViewLeftText>{t('time')} :</TopLeftViewLeftText>
                  </>
                ) : null}
              </TopLeftViewLeft>
              <TopLeftViewRight>
                {pushNum == 0 ? (
                  <TopLeftViewRightText>
                    {typeof coordinate2.speed === 'number' &&
                    coordinate2.speed >= 0
                      ? (coordinate2.speed * 3.6).toFixed(1) + ' km/h'
                      : '0'}
                  </TopLeftViewRightText>
                ) : (
                  <TopLeftViewRightText style={{color: '#FF0000'}}>
                    {pushNum} km/h
                  </TopLeftViewRightText>
                )}
                <TopLeftViewRightText>
                  {new Date(new Date().getTime() - _startTime).getUTCHours() +
                    ' : ' +
                    new Date(new Date().getTime() - _startTime).getMinutes() +
                    ' : ' +
                    new Date(new Date().getTime() - _startTime).getSeconds()}
                </TopLeftViewRightText>
                <TopLeftViewRightText style={{marginTop: 8}}>
                  {linkInfo[4] == 10 ? (
                    <TextColor style={{fontWeight: 'bold', color: '#000000'}}>
                      {t('front')}
                    </TextColor>
                  ) : (
                    <TextColor>{t('front')}</TextColor>
                  )}
                  {' / '}
                  {linkInfo[4] == 20 ? (
                    <TextColor style={{fontWeight: 'bold', color: '#FF7F00'}}>
                      {t('left')}
                    </TextColor>
                  ) : (
                    <TextColor> {t('left')}</TextColor>
                  )}
                  {' / '}
                  {linkInfo[4] == 30 ? (
                    <TextColor style={{fontWeight: 'bold', color: '#FF7F00'}}>
                      {t('right')}
                    </TextColor>
                  ) : (
                    <TextColor> {t('right')}</TextColor>
                  )}
                </TopLeftViewRightText>
                <TopLeftViewRightText>
                  {linkInfo[5] == 1 ? (
                    <TextColor style={{fontWeight: 'bold', color: '#000000'}}>
                      {t('normal')}
                    </TextColor>
                  ) : (
                    <TextColor>{t('normal')}</TextColor>
                  )}
                  {' / '}
                  {linkInfo[5] == 2 ? (
                    <TextColor style={{fontWeight: 'bold', color: '#FF7F00'}}>
                      {t('dozeoff')}
                    </TextColor>
                  ) : (
                    <TextColor> {t('dozeoff')}</TextColor>
                  )}
                </TopLeftViewRightText>

                {/* TopLeftViewDetail TopLeftViewDetail TopLeftViewDetail */}

                {infoTouch == true ? (
                  <>
                    <TopLeftViewRightText style={{marginTop: 8}}>
                      {linkInfo[4] == -1 ? 'X' : face(linkInfo[4])} /{' '}
                      {linkInfo[5] == -1 ? 'X' : eyePoint(linkInfo[5])} /{' '}
                      {linkInfo[6] == -1 ? 'X' : eyePoint(linkInfo[6])}
                    </TopLeftViewRightText>
                    <TopLeftViewRightText>
                      {linkInfo[1] == -1 ? 'X' : linkInfo[1]} /{' '}
                      {linkInfo[2] == -1 ? 'X' : linkInfo[2]} /{' '}
                      {linkInfo[3] == -1 ? 'X' : linkInfo[3]}
                    </TopLeftViewRightText>
                    <TopLeftViewRightText>
                      {coordinate2.latitude.toFixed(5)}
                    </TopLeftViewRightText>
                    <TopLeftViewRightText>
                      {coordinate2.longitude.toFixed(5)}
                    </TopLeftViewRightText>
                    <TopLeftViewRightText>
                      {new Date(coordinate2.timestamp).getHours() +
                        ' : ' +
                        new Date(coordinate2.timestamp).getMinutes() +
                        ' : ' +
                        new Date(coordinate2.timestamp).getSeconds()}
                    </TopLeftViewRightText>
                  </>
                ) : null}
              </TopLeftViewRight>
            </TopLeftViewBasic>
          </TopLeftViewTouch>
        </TopLeftView>
      )}

      <TopRightView style={{marginTop: getStatusBarHeight()}}>
        <IconButton
          style={{flex: 1}}
          icon="menu"
          color="#000000"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </TopRightView>

      {(driving == true && infoTouch == true) || hidden == true ? (
        <CenterTestTestRightView
          style={infoTouch == false && hidden == true ? {opacity: 0} : {}}>
          <IconButton
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#AAA',
              borderRadius: 10,
              borderWidth: 1,
            }}
            icon="ambulance"
            color="red"
            onPress={() => {
              console.log('report');
              setLinkInfo([-1, -1, -1, 151, 10, 1, -1, 0, 0, -1]);
            }}
          />
        </CenterTestTestRightView>
      ) : null}

      <CenterRightView>
        <IconButton
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#AAA',
            borderRadius: 10,
            borderWidth: 1,
          }}
          icon="plus"
          color="#000000"
          onPress={() => {
            setCamera({
              center: {
                latitude: camera.center.latitude,
                longitude: camera.center.longitude,
              },
              heading: 0,
              pitch: 0,
              zoom: camera.zoom + 1,
              altitude: 0,
            });
          }}
        />
        <IconButton
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#AAA',
            borderRadius: 10,
            borderWidth: 1,
          }}
          icon="minus"
          color="#000000"
          onPress={() => {
            setCamera({
              center: {
                latitude: camera.center.latitude,
                longitude: camera.center.longitude,
              },
              heading: 0,
              pitch: 0,
              zoom: camera.zoom - 1,
              altitude: 0,
            });
          }}
        />
      </CenterRightView>

      {(driving == true && infoTouch == true) || hidden == true ? (
        <CenterTestRightView
          style={infoTouch == false && hidden == true ? {opacity: 0} : {}}>
          <IconButton
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#AAA',
              borderRadius: 10,
              borderWidth: 1,
            }}
            icon="sleep"
            color="#AA0000"
            onPress={() => {
              if (alert119) {
                alert119.play();
              }

              setModalVisibleSleep(true);
              setTimeout(() => {
                setModalVisibleSleep(false);
              }, 2000);
              let {latitude, longitude, timestamp} = coordinate2;
              let _markerLocation = {
                latitude,
                longitude,
                bool_report: false,
                bool_sudden_acceleration: false,
                bool_sudden_stop: false,
                bool_sleep: true,
                timestamp, // 이건 앱에서만 활용함
              };
              console.log(_markerLocation);
              console.log(markerLocations.length);
              // 마커를 기록함
              setMarkerLocations([...markerLocations, _markerLocation]);
              if (onSave && userInfo2 && userInfo2.key) {
                if (userInfo2.key != -1 && userInfo2.key != undefined) {
                  // 유저가 있으므로 마커를 웹으로 전송함
                  console.log(_markerLocation);
                  drivingMarkerSave(_markerLocation);
                }
              }
            }}
          />
          <IconButton
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#AAA',
              borderRadius: 10,
              borderWidth: 1,
            }}
            icon="whistle"
            color="#000000"
            onPress={() => {
              myTts(t('sensedfocus'));
            }}
          />
        </CenterTestRightView>
      ) : null}

      {(driving == true && infoTouch == true) || hidden == true ? (
        <CenterTestTestTestRightView
          style={infoTouch == false && hidden == true ? {opacity: 0} : {}}>
          {/* 급가속 */}
          <IconButton
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#AAA',
              borderRadius: 10,
              borderWidth: 1,
            }}
            size="32"
            icon="speedometer"
            color="blue"
            onPress={() => {
              setPushNum(20);
              setInterPlus(true);
              console.log('급가속 체크');
              setTimeout(() => {
                // Tts sensedsuddenacceleration 급가속을 감지
                myTts(t('sensedsuddenacceleration'));

                setInterPlus(false);
                setTimeout(() => {
                  setPushNum(0);
                }, 3000);

                let {latitude, longitude, timestamp} = coordinate2;
                let _markerLocation = {
                  latitude,
                  longitude,
                  bool_report: false,
                  bool_sudden_acceleration: true,
                  bool_sudden_stop: false,
                  bool_sleep: false,
                  timestamp, // 이건 앱에서만 활용함
                };
                console.log(_markerLocation);
                console.log(markerLocations.length);
                // 마커를 기록함
                setMarkerLocations([...markerLocations, _markerLocation]);
                if (onSave && userInfo2 && userInfo2.key) {
                  if (userInfo2.key != -1 && userInfo2.key != undefined) {
                    // 유저가 있으므로 마커를 웹으로 전송함
                    console.log(_markerLocation);
                    drivingMarkerSave(_markerLocation);
                  }
                }
              }, 1500);
            }}
          />
          {/* 급감속 */}
          <IconButton
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#AAA',
              borderRadius: 10,
              borderWidth: 1,
            }}
            size="32"
            icon="speedometer-slow"
            color="green"
            onPress={() => {
              setPushNum(80);
              setInterMinus(true);
              console.log('급정거 체크');
              setTimeout(() => {
                // Tts sensedsuddenstop 급정거 감지
                myTts(t('sensedsuddenstop'));

                setInterMinus(false);
                setTimeout(() => {
                  setPushNum(0);
                }, 3000);

                let {latitude, longitude, timestamp} = coordinate2;
                let _markerLocation = {
                  latitude,
                  longitude,
                  bool_report: false,
                  bool_sudden_acceleration: false,
                  bool_sudden_stop: true,
                  bool_sleep: false,
                  timestamp, // 이건 앱에서만 활용함
                };
                console.log(_markerLocation);
                console.log(markerLocations.length);
                // 마커를 기록함
                setMarkerLocations([...markerLocations, _markerLocation]);
                if (onSave && userInfo2 && userInfo2.key) {
                  if (userInfo2.key != -1 && userInfo2.key != undefined) {
                    // 유저가 있으므로 마커를 웹으로 전송함
                    console.log(_markerLocation);
                    drivingMarkerSave(_markerLocation);
                  }
                }
              }, 1500);
            }}
          />
        </CenterTestTestTestRightView>
      ) : null}

      <BottomLeftViewGPS>
        <IconButton
          icon="crosshairs-gps"
          color="#000000"
          onPress={() => {
            Geolocation.getCurrentPosition(
              async (position) => {
                const {latitude, longitude, speed} = position.coords;
                const {timestamp} = position;
                setCoordinate({
                  latitude: latitude,
                  longitude: longitude,
                  speed: speed,
                  timestamp: timestamp,
                });
                setCamera((camera) => {
                  return {
                    center: {
                      latitude: latitude,
                      longitude: longitude,
                    },
                    heading: 0,
                    pitch: 0,
                    zoom: camera.zoom,
                    altitude: 0,
                  };
                });
              },
              (error) => {
                console.log(error.code, error.message);
              },
              {
                timeout: 0,
                maximumAge: 0,
                enableHighAccuracy: true,
              },
            );
          }}
        />
      </BottomLeftViewGPS>

      {driving && (
        <BottomLeftViewEye>
          <IconButton
            icon={onPolyline ? 'eye' : 'eye-off'}
            color={onPolyline ? '#00FA' : '#AAAA'}
            onPress={() => {
              setOnPolyline(!onPolyline);
              setOnMarker(!onMarker);
            }}
          />
        </BottomLeftViewEye>
      )}

      <BottomRightView
        style={driving ? {backgroundColor: '#00F'} : {backgroundColor: '#FFF'}}>
        <Btn
          onPress={() => {
            if (driving) {
              // 저장해야함
              // _drivingSaveData.Drivingline = [...locations];
              let _drivingSaveData = Object.assign({}, drivingSaveData);
              let _endT = new Date().getTime();
              _setEndTime(() => _endT);
              // console.log(locations);

              if (locations) {
                if (userInfo2 && userInfo2.key) {
                  _drivingSaveData.webUserId = userInfo2.key;
                }
                if (userInfo2 && userInfo2.name) {
                  _drivingSaveData.Drivingline = locations;
                  _drivingSaveData.name = userInfo2.name;
                  _drivingSaveData.startTime = _startTime;
                  _drivingSaveData.endTime = _endT;
                }
                if (markerLocations != undefined) {
                  if (markerLocations.length > 1) {
                    console.log('저장한다 마크마크');
                    _drivingSaveData.DrivingMarker = markerLocations;
                  }
                }
                if (_drivingSaveData.endTime && _drivingSaveData.startTime) {
                  if (
                    _drivingSaveData.endTime - _drivingSaveData.startTime >
                    500
                  ) {
                    console.log('운전을 기록합니다');
                    drivingSave(_drivingSaveData);
                  }
                }
              }
              setDrivingSaveData(undefined);
              setLocations([]); // 초기화
              setMarkerLocations([]);
              // 저장해야함

              // 메인페이지 운전중 체크
              let _defaultInfo = [...defaultInfo];
              _defaultInfo[4] = 0;
              setDefaultInfo(_defaultInfo);
              // 메인페이지 운전중 체크

              // // --- 사고다시 가능
              let _checkInfo = [...checkInfo];
              _checkInfo[0] = 0;
              _checkInfo[1] = 1;
              _checkInfo[2] = 0;
              _checkInfo[3] = 0;
              _checkInfo[4] = 0;
              _checkInfo[6] = 0;
              _checkInfo[7] = 0;
              _checkInfo[8] = 0;
              _checkInfo[9] = 0;
              _checkInfo[10] = 0;
              _checkInfo[11] = 11;
              setCheckInfo(_checkInfo);
              setLinkInfo([-1, -1, -1, -1, -1, -1, -1, 0, 0, -1]);
              // // --- 사고다시 가능
              Geolocation.clearWatch(0);

              // --- 운전 시작시간 클리어 ...
              _setStartTime(0);
              // --- 운전 시작시간 클리어 ...

              setDriving(false); // 운전
              setOnSave(false); // 기록

              setModalVisibleSave(true);
              // Tts stopdrivingmodal 운전을 중지합니다
              myTts(t('stopdrivingmodal'));
              setTimeout(() => {
                setModalVisibleSave(false);
              }, 2000);
              console.log('운전을 종료합니다');
            } else {
              setModalVisibleStart(true);
              // Tts startdrivingmodal 운전을 시작합니다
              myTts(t('startdrivingmodal'));
              setTimeout(() => {
                setModalVisibleStart(false);
              }, 1500);
              setTimeout(() => {
                if (userInfo2 && userInfo2.key) {
                  if (userInfo2.key != -1 && userInfo2.key != undefined) {
                    console.log('아이디 확인, 운전 시작했다고 보고');
                    drivingStart(); // 아이디만 받음
                  }
                }
                setOnPolyline(true);
                setOnMarker(true);

                // 저장해야함
                // save 전에 클리어
                setLocations([]);
                setMarkerLocations([]);
                _setStartTime(new Date().getTime());
                // 저장해야함

                // 운전시작
                let _checkInfo = [...checkInfo];
                _checkInfo[0] = 0;
                _checkInfo[1] = 1;
                _checkInfo[2] = 0;
                _checkInfo[3] = 0;
                _checkInfo[4] = 0;
                _checkInfo[5] = 0;
                _checkInfo[6] = 0;
                _checkInfo[7] = 0;
                _checkInfo[8] = 0;
                _checkInfo[9] = 0;
                _checkInfo[10] = 0;
                _checkInfo[11] = 11;
                setCheckInfo(_checkInfo);
                setLinkInfo([-1, -1, -1, -1, -1, -1, -1, 0, 0, -1]);

                // 메인페이지 운전중 체크
                let _defaultInfo = [...defaultInfo];
                _defaultInfo[4] = 1;
                setDefaultInfo(_defaultInfo);
                // 메인페이지 운전중 체크
                Geolocation.watchPosition(
                  (position) => {
                    let now = new Date();
                    const {latitude, longitude, speed} = position.coords;
                    const {timestamp} = position;
                    setCoordinate({
                      latitude: latitude,
                      longitude: longitude,
                      speed: speed,
                      timestamp: timestamp,
                    });
                    if (driving) {
                      setCamera((camera) => {
                        return {
                          center: {
                            latitude: latitude,
                            longitude: longitude,
                          },
                          heading: 0,
                          pitch: 0,
                          zoom: camera.zoom,
                          altitude: 0,
                        };
                      });
                    }
                  },
                  (error) => {
                    console.log(error);
                  },
                );
                setDriving(true); // 운전
                setOnSave(true); // 기록
              }, 2000);
            }
          }}>
          <BtLabel style={driving ? {color: '#FFFFFF'} : {}}>
            {driving ? t('stopdriving') : t('startdriving')}
          </BtLabel>
        </Btn>
      </BottomRightView>

      {checkInfo[3] == 1 ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleReportCount}>
          <ModalView>
            <LottieViewMyView>
              <LottieView
                style={{backgroundColor: '#FFFFFF'}}
                resizeMode={'contain'}
                source={require('~/Assets/Lottie/i119_count.json')}
                autoPlay
                imageAssetsFolder={'images'}
              />
            </LottieViewMyView>
            <SingoTextView>
              <SingoText>{t('singotext')}</SingoText>
              <SingoTextCount>
                {checkInfo[4] >= 0 && checkInfo[4] < 10
                  ? 10 - checkInfo[4]
                  : ' '}
              </SingoTextCount>
            </SingoTextView>
            <TouchableOpacityView>
              <TouchableOpacity // 신고 취소 버튼
                onPress={() => {
                  console.log('신고 취소');
                  setModalVisibleReportCount(false);
                  let _checkInfo = [...checkInfo];
                  _checkInfo[2] = 0;
                  _checkInfo[3] = 0;
                  _checkInfo[4] = 0;
                  _checkInfo[11] = 119;
                  setCheckInfo(_checkInfo);
                  setLinkInfo([-1, -1, -1, -1, -1, -1, -1, 0, 0, -1]);

                  setTimeout(() => {
                    let __checkInfo = [...checkInfo];
                    __checkInfo[2] = 0;
                    __checkInfo[3] = 0;
                    __checkInfo[4] = 0;
                    __checkInfo[11] = 11;
                    setCheckInfo(__checkInfo);
                  }, 10000);

                  // Tts reportcancel 신고취소 알림
                  myTts(t('reportcancel'));
                }}>
                <ReportCancelBtn>{t('cancel')}</ReportCancelBtn>
              </TouchableOpacity>
            </TouchableOpacityView>
          </ModalView>
        </Modal>
      ) : null}

      {driving ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleSleep}>
          <SleepModalView>
            <SleepModalImageTextView>
              <SleepAlertImage
                source={require('~/Assets/Images/sleepAlertIcon.png')}
              />
              <SleepAlertText>{t('dozeoffalert')} !!</SleepAlertText>
            </SleepModalImageTextView>
          </SleepModalView>
        </Modal>
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleStart}>
        <ModalViewBack>
          <DrivingStartSaveModalView style={{borderColor: '#008800'}}>
            <LottieStartSaveView>
              <LottieView
                style={{backgroundColor: '#FFFFFF'}}
                resizeMode={'contain'}
                source={require('~/Assets/Lottie/car_start.json')}
                autoPlay
                imageAssetsFolder={'images'}
              />
            </LottieStartSaveView>
            <DrivingStartSaveTextView>
              <DrivingStartSaveText>
                {t('startdrivingmodal')}
              </DrivingStartSaveText>
            </DrivingStartSaveTextView>
          </DrivingStartSaveModalView>
        </ModalViewBack>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalVisibleSave}>
        <ModalViewBack>
          <DrivingStartSaveModalView style={{borderColor: '#0000FF'}}>
            <LottieStartSaveView>
              <LottieView
                style={{backgroundColor: '#FFFFFF'}}
                resizeMode={'contain'}
                source={require('~/Assets/Lottie/car_save.json')}
                autoPlay
                imageAssetsFolder={'images'}
              />
            </LottieStartSaveView>
            <DrivingStartSaveTextView>
              <DrivingStartSaveText>
                {t('stopdrivingmodal')}
              </DrivingStartSaveText>
            </DrivingStartSaveTextView>
          </DrivingStartSaveModalView>
        </ModalViewBack>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleReportOk}>
        <ReportOkModalView>
          <ReportOKText>
            {t('kurumamo')}
            {t('ri9')}
          </ReportOKText>
          <ReportTouchableOpacity
            onPress={() => {
              if (singo119) {
                singo119.pause();
                singo119.setCurrentTime(0);
                // singo119.getCurrentTime((seconds) => {
                //   console.log('at ' + seconds);
                //   console.log('신고 취소 버튼');
                // });
                setModalVisibleReportOk(false);
              }
            }}>
            <ReportOKImage
              resizeMode="contain"
              source={require('~/Assets/Images/reportOK.png')}
            />
          </ReportTouchableOpacity>
          <ReportOKText2>{t('reportOKtext2')}</ReportOKText2>
          <ReportOKText3>{t('reportOKtext3')}</ReportOKText3>
        </ReportOkModalView>
      </Modal>
    </>
  );
};

export default MapData;
