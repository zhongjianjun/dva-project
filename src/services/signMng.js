import request from '../utils/request.js';

const signMng = {
    //签约客户管理

    //客户列表
    cstmList: (parameter) => {
        return request('sign/sign-list', {
            body: parameter
        })
    },

    //添加
    cstmAdd: (parameter) => {
        return request('sign/sign-add', {
            body: parameter
        })
    },

    //编辑
    cstmEdit: (parameter) => {
        return request('sign/sign-edit', {
            body: parameter
        })
    },

    //删除
    cstmDel: (parameter) => {
        return request('sign/sign-delete', {
            body: parameter
        })
    },

    //详情
    cstmView: (parameter) => {
        return request("sign/sign-detail", {
            body: parameter
        })
    },

    //楼盘名称列表
    houseNameList: (parameter) => {
        return request("sign/house-names", {
            body: parameter
        })
    },

    //导入文件
    importFile: (parameter) => {
        return request("sign/sign-import", {
            body: parameter
        })
    },

    //上传文件
    uploadFile: (parameter) => {
        return request("expand/file-upload", {
            body: parameter
        })
    },

    //下载模板
    downloadModel: (parameter) => {
        return request("expand/sign-export", {
            body: parameter
        })
    }
}

export default signMng;
