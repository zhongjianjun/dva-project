import request from '../utils/request';

const commonInterface = {
    //所有审核处理接口
    login: (parameter) => {
        return request(parameter.type ? 'http://192.168.1.22:88/account/login' : 'http://192.168.1.22:88/account/login-service', {
            body: parameter
        })
    },

     menu: (parameter) => {
        return request('role/role-menu-index', {
            body: parameter
        })
    },

    
}
export default commonInterface;
