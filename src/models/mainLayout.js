import { getToken } from './../utils/util';
import { routerRedux } from 'dva/router';
import { menu } from '../services/commonInterface';

export default {
  namespace: 'mainLayout',
  state: {
    collapsed: false,
    mode: 'inline',
    menuList: [],
    logStatus:true,
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getMenu({ payload }, { call, put }) {
      const { data,code } = yield call(menu, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            menuList: data,
            logStatus: false
          }
        });
      }else{
        yield put({
          type: 'concat',
          payload: {
            logStatus: true
          }
        });
      }
      

    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      if (!getToken('userToken')) {
        return dispatch(routerRedux.push('/login'));
      }
      return history.listen(({ pathname, query }) => {
        if (pathname === '#/') {
          dispatch({ type: 'getMenu' });
        }
      });
    }
  },
};
