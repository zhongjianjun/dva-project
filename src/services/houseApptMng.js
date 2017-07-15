import request from '../utils/request.js';

const houseApptMng = {
    //楼盘预约

    //预约楼盘列表
    appList: (parameter) => {
        return request('house/appoint-list', {
            body: parameter
        })
    },

    //开启
    appAdd: (parameter) => {
        return request('house/appoint-add', {
            body: parameter
        })
    },

    //关闭
    appClose: (parameter) => {
        return request("house/appoint-close", {
            body: parameter
        })
    },

    //城市列表
    cityList: (parameter) => {
        return request("city/city-open-list", {
            domain: 'houseCenter',
            body: parameter
        })
    }
    
}

export default houseApptMng;
