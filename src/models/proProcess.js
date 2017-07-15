
import { proAdd, proDelete, proEdit, proDetail, statusChange, proList, houseNames, imgUpload } from '../services/proProcess';
import { cityList } from '../services/houseApptMng';

export default {
  namespace: 'proProcess',
  state: {
    list: [],
    totalCount: '',
    currentPageNum: '',
    cityList: [],
    state: '',
    visible: false,
    modalState: true,
    houseList: [],
    previewVisible: false,
    previewImage: '',
    imgId: 1,
    proId: '',
    detailVisible: false,
    accessory: [],
    houseName: '',
    finishTime: '',
    remark: '',
    operateTime: '',
    operator: ''
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
      const { data, code } = yield call(cityList, payload);
      if (code && code == 20000)[
        yield put({
          type: 'concat',
          payload: {
            cityList: data.list
          },
        })
      ]

    },
    *getHouseList({ payload }, { call, put }) {
      const { data } = yield call(houseNames, payload);
      yield put({
        type: 'concat',
        payload: {
          houseList: data.list || []
        },
      });
    },
    *add({ payload }, { call, put }) {
      const { code } = yield call(proAdd, payload);
      if (code == 20000) {
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
    *edit({ payload }, { call, put }) {
      const { code } = yield call(proEdit, payload);
      if (code == 20000) {
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
    *staChange({ payload }, { call, put }) {
      const { code } = yield call(statusChange, payload);
      if (code == 20000) {
        yield put({
          type: 'getList'
        });
      }
    },
    *detail({ payload }, { call, put }) {
      const { data, code } = yield call(proDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            accessory: data.accessory,
            houseName: data.houseName,
            finishTime: data.finishTime,
            remark: data.remark,
            operateTime: data.operateTime,
            operator: data.operator
          },
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
        if (pathname === '/proProcess') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
