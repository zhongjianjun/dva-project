import request from '../utils/request.js';

const proProcess = {
    //工程进度

    //新增工程进度
    proAdd: (parameter) => {
        return request('project/project-add', {
            body: parameter
        })
    },

    //删除工程进度
    proDelete: (parameter) => {
        return request('project/project-delete', {
            body: parameter
        })
    },

    //编辑工程进度
    proEdit: (parameter) => {
        return request("project/project-edit", {
            body: parameter
        })
    },

    //工程进度详情
    proDetail: (parameter) => {
        return request("project/project-detail", {
            body: parameter
        })
    },

    //修改工程状态
    statusChange: (parameter) => {
        return request("project/status-change", {
            body: parameter
        })
    },

    //工程进度列表
    proList: (parameter) => {
        return request("project/project-list", {
            body: parameter
        })
    },

    //楼盘下拉列表
    houseNames: (parameter) => {
        return request("project/house-names", {
            body: parameter
        })
    },

    //新增图片
    imgUpload: (parameter) => {
        return request("expand/upload-pic-qiniu", {
            body: parameter
        })
    }




}

export default proProcess;
