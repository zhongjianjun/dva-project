import React, { Component } from 'react';
import styles from './HandleApptCstmMng.css';
import style from '../index.css';
import { connect } from 'dva';
import { Row, Col, Form, Select, Button, Input, Table, Popconfirm, Message, Modal, Icon, Radio } from 'antd';
import { browserHistory } from 'dva/router';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const confirm = Modal.confirm;
function HandleApptCstmMng(props) {
  let { dispatch, form, loading, visible, viewVisible, value, list, count, currentPage, cityCode, cityName, houseId, houseName, houseList, number, appointId, appointNum, appointName, appointMobile, appointRoom, callStatus } = props;
  const { getFieldDecorator, getFieldValue, resetFields } = form;
  const columns = [
    { title: '序号', render: (a, b, c) => <span>{c + 1}</span> },
    {
      title: '客户姓名',
      dataIndex: 'name',
    }, {
      title: '客户手机',
      dataIndex: 'mobile',
    }, {
      title: '楼盘名称',
      dataIndex: 'houseName',
    }, {
      title: '已购房号',
      dataIndex: 'room',
    }, {
      title: '预约时间',
      dataIndex: 'appointTime',
    }, {
      title: '预约号码',
      dataIndex: 'appointNum',
    }, {
      title: '状态',
      render: (text) => (
        <span>
          {text.status == 1 ? "已签约" : text.status == 2 ? "过号" : text.status == 3 ? "签约失败" : text.status == 4 ? "排队中" : "签约中"}
        </span>
      )
    }, {
      title: '操作',
      render: (text) => {
        if (text.status == 2 || text.status == 3) {
          return (<p><Button onClick={apptView.bind(null, text.id)}>查看</Button><Popconfirm title="你确定要删除吗？" onConfirm={apptDel.bind(null, text.id)}><Button>删除</Button></Popconfirm></p>)
        } else {
          return (<Button onClick={apptView.bind(null, text.id)}>查看</Button>)
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
        type: "handleApptCstmMng/fetch",
        payload: { houseId, currentPage }
      })
      dispatch({
        type: "handleApptCstmMng/concat",
        payload: { currentPage }
      })
    }
  };
  const options = houseList.map((val, index) => { return <Option value={val.houseId + ''} key={index} >{val.houseName}</Option> });
  function getList(value) {
    form.resetFields(['room', 'name', 'mobile', 'status']);
    dispatch({
      type: 'handleApptCstmMng/fetch',
      payload: {
        houseId: value.key
      }
    });
    dispatch({
      type: 'handleApptCstmMng/currentNum',
      payload: {
        houseId: value.key
      }
    });
    dispatch({
      type: 'handleApptCstmMng/concat',
      payload: {
        houseId: value.key
      }
    });
  }
  function handleSearch(e) {
    e.preventDefault();
    form.validateFields(['currentHouse', 'room', 'name', 'mobile', 'status'], (err, values) => {
      dispatch({
        type: 'handleApptCstmMng/fetch',
        payload: {
          houseId: values.currentHouse.key,
          room: values.room,
          name: values.name,
          mobile: values.mobile,
          status: values.status,
          currentPage
        }
      });
    });
  }
  function clearFields() {
    form.resetFields(['room', 'name', 'mobile', 'status']);
    dispatch({ type: 'handleApptCstmMng/fetch', payload: { houseId } });
  }
  function apptView(id) {
    dispatch({ type: 'handleApptCstmMng/apptView', payload: { id } });
  }
  function viewCancel() {
    dispatch({ type: 'handleApptCstmMng/concat', payload: { viewVisible: false } });
  }
  function apptDel(id) {
    dispatch({ type: 'handleApptCstmMng/apptDel', payload: { id: id, houseId } });
  }

  //叫号对话框
  const RadioGroup = Radio.Group;
  const formItemLayout1 = {
    wrapperCol: { span: 12, offset: 6 },
  };
  function applyCall() {
    dispatch({ type: 'handleApptCstmMng/applyCall', payload: { houseId } });
  }
  function applyCancel() {
    dispatch({ type: 'handleApptCstmMng/concat', payload: { visible: false } });
    dispatch({ type: 'handleApptCstmMng/currentNum', payload: { houseId } });
    form.validateFields(['currentHouse', 'room', 'name', 'mobile', 'status'], (err, values) => {
      dispatch({
        type: 'handleApptCstmMng/fetch',
        payload: {
          houseId: values.currentHouse.key,
          room: values.room,
          name: values.name,
          mobile: values.mobile,
          status: values.status,
          currentPage
        }
      });
    });
  }
  function handleCall(e) {
    e.preventDefault();
    const callStatus = getFieldValue("callStatus");
    dispatch({ type: 'handleApptCstmMng/handleCall', payload: { id: appointId, status: callStatus, houseId } });
  }
  return (
    <div>
      <section>
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
            <Col span={6} offset={13}>
              <Row type="flex" align="middle">
                <Col span={12}>
                  <span>当前办理号码：{number}</span>
                </Col>
                <Col span={8} offset={4}>
                  <Button type="primary" onClick={applyCall} >叫号</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        
          <Row className="mg-t-b-20">
            <Col span={5}>
              <FormItem {...formItemLayout} label="客户姓名">
                {getFieldDecorator('name')(<Input placeholder="请输入客户姓名" />)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label="客户手机">
                {getFieldDecorator('mobile')(<Input placeholder="请输入客户手机" />)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label="已购房号">
                {getFieldDecorator('room')(<Input placeholder="请输入已购房号" />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem {...formItemLayout} label="状态" style={{ width: '100%' }}>
                {getFieldDecorator('status')(
                  <Select>
                    <Option value="1">已签约</Option>
                    <Option value="2">过号</Option>
                    <Option value="3">签约失败</Option>
                    <Option value="4">排队中</Option>
                    <Option value="5">签约中</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={2} className="mg-l20">
              <Button type="primary" icon="search" size="large" onClick={handleSearch}></Button>
              <Button type="primary" icon="rollback" size="large" className="mg-l20" onClick={clearFields} ></Button>
            </Col>
          </Row>
          <Modal visible={visible} title={"叫号——" + houseName} footer={null} onCancel={applyCancel} >
            <section>
              <p className="mg-b10">当前号码：{appointNum}</p>
              <p className="mg-b10">签约房号： {appointRoom}</p>
              <p className="mg-b10">客户姓名：{appointName}</p>
              <p className="mg-b10">客户手机号： {appointMobile}</p>
            </section>
            <Form onSubmit={handleCall}>
              <FormItem {...formItemLayout1} >
                {getFieldDecorator('callStatus')(
                  <RadioGroup>
                    <Radio value={1}>签约成功</Radio>
                    <Radio value={3}>签约失败</Radio>
                    <Radio value={2}>过号</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <Row>
                <Col span={2} offset={11}>
                  <Button type="primary" htmlType="submit">叫号</Button>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Form>
      </section>
      <section>
        <Table {...tableProps} />
        <Modal
          title="查看客户信息"
          visible={viewVisible}
          onCancel={viewCancel}
          footer={null}
        >
          <p className="mg-b10">客户姓名：{appointName} </p>
          <p className="mg-b10">客户手机：{appointMobile} </p>
          <p className="mg-b10">签约房号：{appointRoom} </p>
          <p className="mg-b10">预约号码：{appointNum} </p>
          <p className="mg-b10">状态：{callStatus == 1 ? "已签约" : callStatus == 2 ? "过号" : callStatus == 3 ? "签约失败" : callStatus == 4 ? "排队中" : "签约中"}</p>
        </Modal>
      </section>
    </div >
  );
}

HandleApptCstmMng = Form.create()(HandleApptCstmMng);
function mapStateToProps(state) {
  return { loading: state.loading.models.handleApptCstmMng, ...state.handleApptCstmMng };
}
export default connect(mapStateToProps)(HandleApptCstmMng);

