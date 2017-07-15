import commonInterface from './../services/commonInterface';

import { routerRedux } from 'dva/router';
export default {
  namespace: 'login',
  state: {
    token: ""
  },
  reducers: {},
  effects: {
    *login({ payload }, { call, put }) {
      const datas = yield call(commonInterface.login, payload);

      let data = datas.data || [];

      //存入token
      for (let x in data) {
        if (data[x] && typeof data[x] !== 'object') {
          document.cookie = x + "=" + data[x];
        } else {
          for (let y in data[x]) {
            document.cookie = y + "=" + data[x][y];
          }
        }
      }
      if (datas.code == 20000) {
        yield put(routerRedux.push('#/'));
      }
    }
  },
  subscriptions: {},
};
