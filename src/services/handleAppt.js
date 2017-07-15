import request from '../utils/request.js';

const handleAppt = {
    //交房预约

    //交房预约列表
    apptList: (parameter) => {
        return request('room/back-room-list', {
            body: parameter
        })
    },

    //预约删除
    apptDel: (parameter) => {
        return request('room/back-room-delete', {
            body: parameter
        })
    },

    //预约详情
    apptView: (parameter) => {
        return request("room/back-room-detail", {
            body: parameter
        })
    },

    //点击叫号
    clickCall: (parameter) => {
        return request('room/back-room-call', {
            body: parameter
        })
    },

    //提交叫号
    handleCall: (parameter) => {
        return request('room/back-room-called', {
            body: parameter
        })
    },

    //当前办理预约号码
    currentNum: (parameter) => {
        return request('room/back-room-number', {
            body: parameter
        })
    }
}

export default handleAppt;
