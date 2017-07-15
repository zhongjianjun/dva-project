import { apptList, apptDel, apptView, clickCall, handleCall, currentNum } from '../services/handleAppt.js';
import { houseNameList } from '../services/signMng.js';
import { Alert, message } from 'antd';
export default {
  namespace: 'handleApptCstmMng',
  state: {
    value: "",
    list: [],
    count: 0,
    currentPage: 1,
    visible: false,
    viewVisible: false,
    houseId: "",
    houseName: "",
    cityCode: "",
    cityName: "",
    houseList: [],
    number: "",
    appointId: "",
    appointNum: "",
    appointName: "",
    appointMoblie: "",
    appointRoom: "",
    callStatus: ""
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
        yield put({
          type: 'concat',
          payload: {
            houseList: data.list,
            houseId: data.list[0].houseId,
            houseName: data.list[0].houseName
          }
        });
        yield put({
          type: 'fetch',
          payload: {
            houseId: data.list[0].houseId
          }
        });
        yield put({
          type: 'currentNum',
          payload: {
            houseId: data.list[0].houseId
          }
        })
      }
    },
    *fetch({ payload }, { call, put }) {
      const { data, code } = yield call(apptList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            count: data.count
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
          },
        });
      }
    },
    *currentNum({ payload }, { call, put }) {
      const { data, code } = yield call(currentNum, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            number: data.number
          },
        });
      }
    },
    *applyCall({ payload }, { call, put }) {
      const { data, code } = yield call(clickCall, payload);
      if (code == 20000 && data.id != 0) {
        yield put({
          type: 'concat',
          payload: {
            appointId: data.id,
            appointNum: data.appointNum,
            appointName: data.name,
            appointMobile: data.mobile,
            appointRoom: data.room,
            visible: true
          },
        });
      } else {
        message.warning('暂无新客户');
      }
    },
    *handleCall({ payload }, { call, put }) {
      const { data, code } = yield call(handleCall, payload);
      if (code == 20000 && data.id != 0) {
        yield put({
          type: 'concat',
          payload: {
            houseId: payload.houseId,
            houseName: payload.houseName,
            visible: false
          }
        });
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.houseId
          }
        });
        yield put({
          type: 'currentNum',
          payload: {
            houseId: payload.houseId
          }
        })
      }
    },
    *apptView({ payload }, { call, put }) {
      const { data, code } = yield call(apptView, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            viewVisible: true,
            appointNum: data.appointNum,
            appointName: data.name,
            appointMobile: data.mobile,
            appointRoom: data.room,
            callStatus: data.status
          }
        });
      }
    },
    *apptDel({ payload }, { call, put }) {
      const { data, code } = yield call(apptDel, payload);
      if (code == 20000) {
        yield put({
          type: 'fetch',
          payload: {
            houseId: payload.houseId
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/handleApptCstmMng') {
          dispatch({ type: 'init', payload: {} });
        }
      });
    },
  },
};
