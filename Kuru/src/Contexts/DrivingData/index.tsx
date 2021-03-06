/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '~/Contexts/User/index';

interface Props {
  cache?: boolean;
  children: JSX.Element | Array<JSX.Element>;
}

const DrivingDataContext = createContext<IDrivingData>({
  drivingSaveDataArr: [],
  setDrivingSaveDataArr: (_data: any) => {},

  drivingSaveData: undefined,
  setDrivingSaveData: (_data: any) => {},

  linkInfo: [],
  setLinkInfo: (_data: any) => {},
  defaultInfo: [],
  setDefaultInfo: (_data: any) => {},
  checkInfo: [],
  setCheckInfo: (_data: any) => {},

  drivingStart: () => {},
  drivingMarkerSave: () => {},
  dummyAdd: () => {},
  dummyRemove: () => {},

  drivingSave: (_data?: IDrivingSaveData) => {},
  drivingDelete: () => {},
});

const DrivingDataProvider = ({cache, children}: Props) => {
  const {URL, userInfo2} = useContext<IUserContext>(UserContext);
  const [webDrivingDBId, setWebDrivingDBId] = useState<number>(-1);

  // ## 필요한것 ... -> 운전시작시간, 운전종료시간, 위도경도 배열, 감지 배열(위도, 경도, 신고, 급가속, 급정거, 졸음,  날짜, 시간)
  const [drivingSaveDataArr, setDrivingSaveDataArr] = useState<
    Array<IDrivingSaveData> | undefined
  >([]); // 따로두면 시간,라인,마커 관계힘듬
  const [drivingSaveData, setDrivingSaveData] = useState<IDrivingSaveData>(); // 따로두면 시간,라인,마커 관계힘듬
  // 라즈베리 + 아두이노 정보 -> 10개
  // [ 신고버튼상태, 요, 피치, 롤, 시선방향, 좌눈, 우눈, 0, 0, 카운터 ]
  const [linkInfo, setLinkInfo] = useState<Array<number>>([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    0,
    -1,
  ]);
  // 휴대폰 기본 확인 정보
  // [ 공백, 위도, 경도, 링크상태, 운전상태, 현재속도, 이전속도 ] -> 7개
  const [defaultInfo, setDefaultInfo] = useState<Array<number>>([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]);

  // [ 운전시작, 운전종료, 사고상태, 신고접수상태, 신고접수카운트, 신고완료상태, 급가속상태, 급정거상태, 졸음상태, 주시태만상태, 버튼소모상태, 터치소모상태]
  const [checkInfo, setCheckInfo] = useState<Array<number>>([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    11,
  ]);

  const getCacheData = async (key: string) => {
    // 활용해서 운전기록뭉치 (날짜 : {기록 : {위도, 경도} , 포인트 : {내용}  })
    const cacheData = await AsyncStorage.getItem(key);
    if (cache === false || cacheData === null) {
      return undefined;
    }
    const cacheList = JSON.parse(cacheData); // 캐시 리스트에서 날짜 조회해서 지우기, 보관날짜 생각 년월일 숫자로 ...
    return cacheList;
  };

  const setDrivingList = async () => {
    const cachedData = await getCacheData('DrivingList');
    if (cachedData) {
      console.log('get Cache Data List > ', cachedData.length);
      setDrivingSaveDataArr(cachedData);
      return;
    } else {
      console.log('get Cache Data List x');
      return;
    }
  };

  const drivingStart = async () => {
    if (userInfo2) {
      // 더블 분기
      console.log('운전시작 요청입니다');
      console.log(userInfo2.key);
      console.log(URL);
      fetch(URL + '/app', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          _option: 3, // 운전시작 로직
          _key: userInfo2.key,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          // 아이디만 받음, 종료할때 사용해야함
          console.log('json');
          console.log(json);
          setWebDrivingDBId(json);
          console.log('webDrivingDBId');
          console.log(webDrivingDBId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // 위험 감지
  const drivingMarkerSave = (_markerLocation: IMarkerlocation) => {
    console.log('>> 위험 감지');
    if (_markerLocation) {
      if (userInfo2) {
        // 더블 분기
        if (userInfo2.key !== -1 && userInfo2.key !== undefined) {
          console.log('>> 위험 감지 시도');
          // 값이 있을때 던진다
          fetch(URL + '/app', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              _option: 5, // 운전 감지 로직
              _key: userInfo2.key,
              _drive_id: webDrivingDBId,
              // _drive_id: webDrivingDBId,
              _latitude: _markerLocation.latitude,
              _longitude: _markerLocation.longitude,
              _bool_report: _markerLocation.bool_report,
              _bool_sudden_acceleration:
                _markerLocation.bool_sudden_acceleration,
              _bool_sudden_stop: _markerLocation.bool_sudden_stop,
              _bool_sleep: _markerLocation.bool_sleep,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              // 운전 감지 하고 저장하는거 웹에 던질때 씀
              console.log('>> drivingMarkerSave json');
              console.log(json);

              console.log('이프문 드러간다');
              if (json.bool_report === true) {
                console.log('신고 접수했다 간다');
                // 신고 프로세스
                fetch(URL + '/app', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                  },
                  body: JSON.stringify({
                    _option: 6, // 신고 로직
                    _key: userInfo2.key,
                    _latitude: _markerLocation.latitude,
                    _longitude: _markerLocation.longitude,
                  }),
                })
                  .then((response) => response.json())
                  // eslint-disable-next-line no-shadow
                  .then((json) => {
                    // 운전이 잘못된 운전이라 신고가 간다
                    console.log('운전이 잘못된 운전이라 신고가 갔어');
                    console.log(json);
                  })
                  .catch((error) => {
                    console.log('웹이 잘못했어');
                    console.log(error);
                  });
              } else {
                console.log('위험을 감지했지만 신고는 안했다');
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  };

  // 종료 + 저장 ...
  const drivingSave = async (data?: IDrivingSaveData) => {
    console.log('운전 기록 시도');
    if (drivingSaveDataArr !== undefined && data !== undefined) {
      let list = [...drivingSaveDataArr, data];
      console.log('운전 기록 성공', list.length);
      setDrivingSaveDataArr(list);
      AsyncStorage.setItem('DrivingList', JSON.stringify(list));
      if (userInfo2) {
        // 더블 분기
        if (userInfo2.key !== -1 && userInfo2.key !== undefined) {
          console.log('운전 기록 웹 전송 시도');
          console.log(webDrivingDBId);
          // 운전 종료 됬을때 던진다
          fetch(URL + '/app', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              _option: 4, // 운전종료 로직
              _key: userInfo2.key,
              _drive_id: webDrivingDBId,
              _sleep_count: 10, // 값 넣어야함
              _sudden_stop_count: 5, // 값 넣어야함
              _sudden_acceleration_count: 15, // 값 넣어야함
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              // 아이디만 받음, 종료할때 사용해야함
              console.log('운전 종료 + 저장 json');
              console.log(json);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    } else {
      console.log('운전 기록 실패');
    }
  };

  const drivingDelete = async () => {
    console.log('drivingDelete');
    AsyncStorage.removeItem('DrivingList');
    setDrivingSaveDataArr([]);
  };

  const dummyAdd = async (data?: IDrivingSaveData) => {
    if (drivingSaveDataArr !== undefined && data !== undefined) {
      let list = [...drivingSaveDataArr, data];
      setDrivingSaveDataArr(list);
      AsyncStorage.setItem('DrivingList', JSON.stringify(list));
    }
    console.log('dummyAdd');
  };

  const dummyRemove = async () => {
    if (drivingSaveDataArr !== undefined) {
      let list = [...drivingSaveDataArr];
      list.splice(list.length - 1, 1);
      setDrivingSaveDataArr(list);
      AsyncStorage.setItem('DrivingList', JSON.stringify(list));
    }
    console.log('dummyRemove');
  };

  useEffect(() => {
    setDrivingList(); // 리스트 호출
  }, []);

  return (
    <DrivingDataContext.Provider
      value={{
        drivingSaveDataArr,
        setDrivingSaveDataArr,
        drivingSaveData,
        setDrivingSaveData,
        defaultInfo,
        setDefaultInfo,
        linkInfo,
        setLinkInfo,
        checkInfo,
        setCheckInfo,
        drivingStart,
        drivingMarkerSave,
        dummyAdd,
        dummyRemove,
        drivingSave, // 저장 이외에 삭제도 필요함 하지만 지금은 필요하지않지
        drivingDelete,
      }}>
      {children}
    </DrivingDataContext.Provider>
  );
};

export {DrivingDataProvider, DrivingDataContext};
