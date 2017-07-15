import { cstmList, cstmAdd, cstmEdit, cstmDel, cstmView, houseNameList, importFile, uploadFile, downloadModel } from '../services/signMng.js';

export default {
  namespace: 'signCstmMng',
  state: {
    list: [],
    count: 0,
    currentPage: 1,
    viewVisible: false,
    editVisible: false,
    uploadVisible: false,
    houseId: "",
    houseName: "",
    cityCode: "",
    cityName: "",
    houseList: [],
    id: "",
    customerName: "",
    customerMobile: "",
    roomNumber: "",
    editStatus: "",
    fileList: [],
    signFile: "",
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      const { data, code } = yield call(houseNameList, payload);
      if (code == 20000) {
        const houseId = data.list[0].houseId || '',
          houseName = data.list[0].houseName || '',
          cityCode = data.list[0].cityCode || '',
          cityName = data.list[0].cityName || '';
        yield put({
          type: 'concat',
          payload: {
            houseList: data.list,
            houseId: data.list[0].houseId,
            houseName: data.list[0].houseName,
            cityCode: data.list[0].cityCode,
            cityName: data.list[0].cityName
          }
        });
        yield put({
          type: 'fetch',
          payload: {
            houseId: data.list[0].houseId
          }
        })
      }
    },
    *fetch({ payload }, { call, put }) {
      const { data, code } = yield call(cstmList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            count: data.totalCount
          },
        });
      }
    },
    *getHouseName({ payload }, { call, put }) {
      const { data, code } = yield call(houseNameList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            houseList: data.list,
            houseId: data.list[0].houseId || '',
            houseName: data.list[0].houseName || '',
            cityCode: data.list[0].cityCode || '',
            cityName: data.list[0].cityName || ''
          },
        });
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.houseId
          }
        })
      }
    },
    *cstmView({ payload }, { call, put }) {
      const { data, code } = yield call(cstmView, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            viewVisible: true,
            customerName: data.customerName,
            customerMobile: data.customerMobile,
            houseName: data.houseName,
            roomNumber: data.roomNumber,
            callStatus: data.status
          },
        });
      }
    },
    *cstmAdd({ payload }, { call, put }) {
      const { data, code } = yield call(cstmAdd, payload);
      if (code == 20000) {
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.values.currentHouse.key,
            roomNumber: payload.values.room,
            customerName: payload.values.name,
            customerMobile: payload.values.mobile,
            state: payload.values.state,
            currentPage: payload.currentPage
          },
        });
        yield put({
          type: 'concat',
          payload: {
            editVisible: false,
          },
        });
      }
    },
    *cstmEdit({ payload }, { call, put }) {
      const { data, code } = yield call(cstmEdit, payload);
      if (code == 20000) {
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.values.currentHouse.key,
            roomNumber: payload.values.room,
            customerName: payload.values.name,
            customerMobile: payload.values.mobile,
            state: payload.values.state,
            currentPage: payload.currentPage
          },
        });
        yield put({
          type: 'concat',
          payload: {
            editVisible: false
          },
        });
      }
    },
    *cstmDel({ payload }, { call, put }) {
      const { data, code } = yield call(cstmDel, payload);
      if (code == 20000) {
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.houseId
          }
        });
      }
    },
    *uploadFile({ payload }, { call, put }) {
      const { data, code } = yield call(uploadFile, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            fileName: data.fileName
          }
        });
      }
    },

    *importFile({ payload }, { call, put }) {
      const { data, code } = yield call(importFile, payload);
      if (code == 20000) {
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.houseId
          }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/signCstmMng') {
          dispatch({ type: 'init', payload: {} });
        }
      });
    },
  },
};
