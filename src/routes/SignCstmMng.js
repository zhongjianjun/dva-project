import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Button, Input, Table, Modal, Icon, Radio, Popconfirm, Upload } from 'antd';
import styles from './SignCstmMng.css';
import style from '../index.css';
import { browserHistory } from 'dva/router';
import { getToken } from '../utils/util.js';

const dataSource = [];
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const formItemLayout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const Option = Select.Option;

function SignCstmMng(props) {
  let { dispatch, form, list, loading, count, currentPage, viewVisible, editVisible, uploadVisible, houseList, houseId, houseName, cityCode, cityName, id, customerName, customerMobile, roomNumber, editStatus, fileList, signFile, fileName } = props;
  const { getFieldDecorator, getFieldValue, resetFields } = form;
  function getList(value) {
    form.resetFields(['room', 'name', 'mobile', 'state']);
    dispatch({
      type: 'signCstmMng/fetch',
      payload: {
        houseId: value.key,
      }
    });
    dispatch({
      type: 'signCstmMng/concat',
      payload: {
        houseId: value.key,
        houseName: value.label
      }
    });
  }
  function handleSearch(e) {
    e.preventDefault();
    form.validateFields(['currentHouse', 'room', 'name', 'mobile', 'state'], (err, values) => {
      dispatch({
        type: 'signCstmMng/fetch',
        payload: {
          houseId: values.currentHouse.key,
          roomNumber: values.room,
          customerName: values.name,
          customerMobile: values.mobile,
          state: values.state
        }
      });
    });
  }
  function clearFields() {
    form.resetFields(['room', 'name', 'mobile', 'state']);
    dispatch({ type: 'signCstmMng/fetch', payload: { houseId } });
  }

  //客户查看
  function cstmView(text) {
    dispatch({
      type: 'signCstmMng/concat', payload: {
        viewVisible: true,
        customerName: text.customerName,
        customerMobile: text.customerMobile,
        roomNumber: text.roomNumber,
        houseName: text.houseName
      }
    });
  }
  function viewCancel() {
    dispatch({ type: 'signCstmMng/concat', payload: { viewVisible: false } });
  }

  //客户编辑&&新增
  function addSign() {
    form.resetFields(['customerName', 'customerMobile', 'roomNumber']);
    form.setFieldsValue({ houseName: houseName });
    dispatch({ type: 'signCstmMng/concat', payload: { editVisible: true, editStatus: 1 } });
  }
  function editSign(text) {
    dispatch({ type: 'signCstmMng/concat', payload: { editVisible: true, editStatus: 2, id: text.id } });
    form.setFieldsValue({
      customerName: text.customerName,
      customerMobile: text.customerMobile,
      houseName: text.houseName,
      roomNumber: text.roomNumber
    });
  }
  function modalSubmit() {
    if (editStatus == 1) {
      form.validateFields((err, values) => {
        if (err) { return; }
        dispatch({
          type: 'signCstmMng/cstmAdd',
          payload: {
            customerName: values.customerName,
            customerMobile: values.customerMobile,
            houseName: values.houseName,
            roomNumber: values.roomNumber,
            houseId: values.currentHouse.key,
            cityCode,
            cityName,
            values,
            currentPage
          }
        });
      });
    } else {
      props.form.validateFields((err, values) => {
        if (err) { return; }
        dispatch({
          type: 'signCstmMng/cstmEdit',
          payload: {
            id,
            customerName: values.customerName,
            customerMobile: values.customerMobile,
            houseName: values.houseName,
            roomNumber: values.roomNumber,
            houseId,
            cityCode,
            cityName,
            values,
            currentPage
          }
        });
      });
    }
  }
  function editCancel() {
    dispatch({ type: 'signCstmMng/concat', payload: { editVisible: false } });
  }

  //删除
  function cstmDel(id) {
    dispatch({ type: 'signCstmMng/cstmDel', payload: { id, houseId } });
  }

  //上传
  function uploadCstm() {
    dispatch({ type: 'signCstmMng/concat', payload: { uploadVisible: true } });
  }

  function uploadCancel() {
    dispatch({ type: 'signCstmMng/concat', payload: { uploadVisible: false, fileList: [] } });
  }

  function modelDownload() {
    window.open('http://192.168.1.22:88/expand/sign-export');
  }

  function handleChange(info) {
    dispatch({ type: 'signCstmMng/concat', payload: { fileList: info.fileList.slice(-1) } });
    if (info.file.status == "done" && info.file.response) {
      dispatch({ type: 'signCstmMng/concat', payload: { signFile: info.file.response.data.fileName } });
    }
  }

  function modelUpload() {
    dispatch({ type: 'signCstmMng/importFile', payload: { signFile, houseId, houseName, cityCode, cityName } });
    dispatch({ type: 'signCstmMng/concat', payload: { uploadVisible: false, fileList: [] } });
    form.resetFields(['room', 'name', 'mobile', 'state']);
  }

  //表格参数
  const columns = [{
    title: '序号',
    render: (a, b, c) => <span>{c + 1}</span>
  }, {
    title: '客户姓名',
    dataIndex: 'customerName',
  }, {
    title: '客户手机',
    dataIndex: 'customerMobile',
  }, {
    title: '楼盘名称',
    dataIndex: 'houseName',
  }, {
    title: '已购房号',
    dataIndex: 'roomNumber',
  }, {
    title: '状态',
    dataIndex: 'state',
    render: (text) => (
      <span>
        {text == 1 ? "未取号" : text == 2 ? "排队中" : text == 3 ? "签约成功" : text == 4 ? "过号" : text == 5 ?  "签约失败" : "签约中"}
      </span>
    )
  }, {
    title: '操作人',
    dataIndex: 'operator',
  }, {
    title: '操作',
    render: (text) => {
      if (text.state == 2 || text.state == 3) {
        return (<Button onClick={cstmView.bind(null, text)}>查看</Button>)
      } else {
        return (<p><Button onClick={editSign.bind(null, text)}>编辑</Button><Popconfirm title="你确定要删除吗？" onConfirm={cstmDel.bind(null, text.id)}><Button>删除</Button></Popconfirm></p>)
      }
    }
  }];
  const tableProps = {
    columns: columns,
    bordered: true,
    dataSource: list,
    rowKey: 'id',
    loading: loading,
    pagination: {
      total: count,
      showTotal: (count) => `共 ${count} 条`,
      current: currentPage
    },
    onChange: (pagination) => {
      currentPage = pagination.current;
      dispatch({
        type: "signCstmMng/fetch",
        payload: { houseId, currentPage }
      })
      dispatch({
        type: "signCstmMng/concat",
        payload: { currentPage }
      })
    }
  }
  const options = houseList.map((val, index) => { return <Option value={val.houseId + ''} key={index} >{val.houseName}</Option> });

  const uploadProps = {
    name: 'signFile',
    defaultFileList: {},
    fileList,
    action: 'http://192.168.1.22:88/expand/file-upload',
    data: { token: getToken('userToken') },
    multiple: false,
    accept: '.xls, .xlsx',
    showUploadList: true,
    onChange: handleChange
  };

  return (
    <div>
      <Form layout="inline">
        <Row className="mg-t20 bd-b1 pd-b20">
          <Col span={5}>
            <FormItem label="当前楼盘" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
              {getFieldDecorator('currentHouse', { onChange: getList, initialValue: { key: houseId, label: houseName } })(
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  notFoundContent="无数据"
                  labelInValue
                  style={{ width: 150 }}
                >
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col offset={11} span={4}>
            <Button type="primary" icon="plus" onClick={addSign}>新增签约客户</Button>
          </Col>
          <Col span={4}>
            <Button type="primary" icon="plus" onClick={uploadCstm}>批量导入签约客户</Button>
          </Col>
        </Row>
        <Row className="mg-t-b-20">
          <Col span={5}>
            <FormItem {...formItemLayout} label="已购房号">
              {getFieldDecorator('room')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formItemLayout} label="客户姓名">
              {getFieldDecorator('name')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formItemLayout} label="客户手机">
              {getFieldDecorator('mobile')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem {...formItemLayout} label="状态" style={{ width: '100%' }}>
              {getFieldDecorator('state')(
                <Select>
                  <Option value="1">未取号</Option>
                  <Option value="2">排队中</Option>
                  <Option value="3">签约成功</Option>
                  <Option value="4">过号</Option>
                  <Option value="5">签约失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={2} className="mg-l20">
            <Button type="primary" icon="search" size="large" onClick={handleSearch}></Button>
            <Button type="primary" icon="rollback" size="large" className="mg-l20" onClick={clearFields} ></Button>
          </Col>
        </Row>
        <Modal visible={editVisible} title={editStatus == 1 ? "新增签约客户" : "编辑签约客户"} footer={null} onCancel={editCancel} >
          <Row>
            <FormItem {...formItemLayout1} label="客户姓名" >
              {getFieldDecorator('customerName', {
                rules: [{ required: true, message: '请输入客户姓名!' }, { max: 15, message: '客户姓名不能超过15位' }],
              })(
                <Input />
                )}
            </FormItem>
          </Row>
          <Row>
            <FormItem {...formItemLayout1} label="客户手机" >
              {getFieldDecorator('customerMobile', {
                rules: [
                  { required: true, message: '请输入手机号!' },
                  { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入11位手机号!' }
                ]
              })(
                <Input />
                )}
            </FormItem>
          </Row>
          <Row>
            <FormItem {...formItemLayout1} label="楼盘" >
              {getFieldDecorator('houseName', {
                rules: [{ required: true, message: '请输入楼盘名称!' }, { max: 20, message: '楼盘名称不能超过20位!' }],
              })(
                <Input disabled />
                )}
            </FormItem>
          </Row>
          <Row>
            <FormItem {...formItemLayout1} label="签约房号" >
              {getFieldDecorator('roomNumber', {
                rules: [{ required: true, message: '请输入签约房号!' }, { max: 20, message: '房号不能超过20位!' }],
              })(
                <Input />
                )}
            </FormItem>
          </Row>
          <Row>
            <Col span={2} offset={11}>
              <Button type="primary" onClick={modalSubmit}>保存</Button>
            </Col>
          </Row>
        </Modal>
      </Form>
      <Table {...tableProps}></Table>
      <Modal
        title="查看签约客户"
        visible={viewVisible}
        onCancel={viewCancel}
        footer={null}
      >
        <p className="mg-b10">客户姓名：{customerName} </p>
        <p className="mg-b10">客户手机：{customerMobile} </p>
        <p className="mg-b10">楼盘名称：{houseName}</p>
        <p className="mg-b10">签约房号：{roomNumber} </p>
      </Modal>
      <Modal
        title="批量导入签约客户"
        visible={uploadVisible}
        onCancel={uploadCancel}
        onOk={modelUpload}
        okText="导入"
        cancelText="取消"
      >
        <Row className="mg-b20">
          <Col span={3} offset={3}>
            <span>模板下载：</span>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={modelDownload}>点击下载模板</Button>
          </Col>
        </Row>
        <Row>
          <Col span={3} offset={3}>
            <span>选择文件：</span>
          </Col>
          <Col span={12}>
            <Upload {...uploadProps} fileList={fileList} >
              <Button>
                <Icon type="upload" /> 批量上传签约客户
              </Button>
            </Upload>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

SignCstmMng = Form.create()(SignCstmMng);

function mapStateToProps(state) {
  return { loading: state.loading.models.signCstmMng, ...state.signCstmMng };
}

export default connect(mapStateToProps)(SignCstmMng);