interface IUserInfo {
  name: string | any;
  email: string | any;
  key: string | any;
}
interface IUserInfo2 {
  name: string | any;
  email: string | any;
  key: string | any;
}

interface IUserContext {
  URL: string | undefined;
  updateURL: (url: string) => void;
  userInfo: IUserInfo | undefined;
  userInfo2: IUserInfo | undefined;
  login: (email: string, password: string) => void;
  login2: (email: string, password: string) => void;
  getUserInfo: () => void;
  getUserInfo2: () => void;
  logout: () => void;
  logout2: () => void;
}
