import { appList, appAdd, appClose, cityList } from '../services/houseApptMng';

export default {
  namespace: 'houseApptMng',
  state: {
    list: [],
    totalCount: '',
    currentPageNum: '',
    cityList: [],
    state: '',
    visible: false,
    cityCode: '',
    cityName: '',
    houseId: '',
    houseName: ''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'getList'
      });
      yield put({
        type: 'getCityList'
      });
    },
    *getList({ payload }, { call, put }) {
      const { data } = yield call(appList, payload);
      yield put({
        type: 'concat',
        payload: {
          list: data.list || [],
          totalCount: data.totalCount || ''
        },
      });
    },
    *getCityList({ payload }, { call, put }) {
      const { data,code } = yield call(cityList, payload);
      if(code && code == 20000){
        yield put({
          type: 'concat',
          payload: {
            cityList: data.list || []
          },
        });
      }
    },
    *add({ payload }, { call, put }) {
      const { code } = yield call(appAdd, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            visible: false
          },
        });
        yield put({
          type: 'getList'
        });
      }
    },
    *close({ payload }, { call, put }) {
      const { code } = yield call(appClose, payload);
      if (code === 20000) {
        yield put({
          type: 'getList'
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/houseApptMng') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
