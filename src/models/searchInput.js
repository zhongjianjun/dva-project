import { getToken } from './../utils/util';
import { routerRedux } from 'dva/router';
import { houseNameList } from '../services/signMng.js';
export default {
  namespace: 'searchInput',
  state: {
    mode: 'combobox',
    list: [],
    defaultSelectedKeys: [],
    value: ""
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getHouseName({ payload }, { call, put }) {
      const { data, code } = yield call(houseNameList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            houseList: data.list,
            houseId: payload.houseId,
            houseName: payload.houseName
          },
        });
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.houseId,
          },
        });
        yield put({
          type: 'currentNum',
          payload: {
            houseId: payload.houseId,
          },
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
        dispatch({
          type: 'concat',
          payload: {
            // defaultSelectedKeys: pathname !== '/' ? pathname.substring(1, pathname.length) : pathname
          }
        })

      });




    }
  },
};
