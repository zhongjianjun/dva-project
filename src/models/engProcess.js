import { proAdd, proDelete, proEdit, proDetail, statusChange, proList, imgUpload } from '../services/proProcess';
import { cityList } from '../services/houseApptMng';

export default {
  namespace: 'engProcess',
  state: {
    list: [],
    totalCount: '',
    currentPageNum: '',
    cityList: [],
    state: '',
    visible: false,
    modalState: true,
    imgList:[]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'getList' });
      yield put({ type: 'getCityList' });
    },
    *getList({ payload }, { call, put }) {
      const { data } = yield call(proList, payload);
      yield put({
        type: 'concat',
        payload: {
          list: data.list || [],
          totalCount: data.totalCount || ''
        },
      });
    },
    *getCityList({ payload }, { call, put }) {
      const { data } = yield call(cityList, payload);
      yield put({
        type: 'concat',
        payload: {
          cityList: data.list || []
        },
      });
    },
    *add({ payload }, { call, put }) {
      const { code } = yield call(proAdd, payload);
      if (code == 20000) {
        yield put({
          type: 'getList'
        });
      }
    },
    *edit({ payload }, { call, put }) {
      const { code } = yield call(proEdit, payload);
      if (code == 20000) {
        yield put({
          type: 'getList'
        });
      }
    },
    *staChange({ payload }, { call, put }) {
      const { code } = yield call(statusChange, payload);
      if (code == 20000) {
        yield put({
          type: 'getList'
        });
      }
    },
    *detail({ payload }, { call, put }) {
      const { code } = yield call(proDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'getList'
        });
      }
    },
    *proDel({ payload }, { call, put }) {
      const { code } = yield call(proDelete, payload);
      if (code == 20000) {
        yield put({
          type: 'getList'
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/engProcess') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
