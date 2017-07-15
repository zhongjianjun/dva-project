import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Table, Col, Popconfirm, Modal, Select, Row, Badge, DatePicker } from 'antd';
import styles from './HouseApptMng.css';
const { RangePicker } = DatePicker;
const FormItem = Form.Item, Option = Select.Option;

function HouseApptMng(props) {

  let { dispatch, loading, form, list, totalCount, currentPageNum, cityList, state, visible, cityCode, cityName, houseId, houseName } = props;

  function houseClose(id) {
    dispatch({ type: 'houseApptMng/close', payload: { id: id } });
  }

  function houseAddBtn(val) {
    dispatch({
      type: 'houseApptMng/concat', payload: {
        visible: true,
        cityCode: val.cityCode,
        cityName: val.cityName,
        houseId: val.houseId,
        houseName: val.houseName,
      }
    });
  }

  function modalCancel() {
    form.resetFields(['time']);
    dispatch({ type: 'houseApptMng/concat', payload: { visible: false } });
  }

  function modalSubmit() {
    form.validateFields(['time'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'houseApptMng/add', payload: {
          cityCode,
          cityName,
          houseId,
          houseName,
          startTime: values.time[0].format('YYYY-MM-DD'),
          endTime: values.time[1].format('YYYY-MM-DD')
        }
      });
    })
  }

  function search() {
    let values = form.getFieldsValue(['houseName', 'cityCode']);
    dispatch({ type: 'houseApptMng/getList', payload: { houseName: values.houseName, cityCode: values.cityCode } });
  }

  function searchClear() {
    form.resetFields(["houseName", "cityCode"]);
    dispatch({ type: 'houseApptMng/getList' });
  }

  const columns = [{
    title: '序号',
    render: (a, b, c) => {
      return <span>{c + 1}</span>
    }
  }, {
    title: '楼盘名称',
    dataIndex: 'houseName',
    key: 'houseName',

  }, {
    title: '所属城市',
    dataIndex: 'cityName',
    key: 'cityName',
  }, {
    title: '预约开启状态',
    dataIndex: 'state',
    key: 'state',
    filters: [{
      text: '已关闭',
      value: '0',
    }, {
      text: '开启中',
      value: '1',
    }],
    filterMultiple: false,
    render: text => {
      return <span><Badge status={text == 1 ? 'success' : 'default'} />{text == 1 ? '开启中' : '已关闭'}</span>
    }
  }, {
    title: '预约开启时间',
    dataIndex: 'startTime',
    key: 'startTime'
  }, {
    title: '预约结束时间',
    dataIndex: 'endTime',
    key: 'endTime'
  }, {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator'
  }, {
    title: '操作',
    render: text => {
      if (text.state == 1) {
        return <Popconfirm title='确认关闭预约？' onConfirm={houseClose.bind(null, text)}> <a>关闭预约</a> </Popconfirm>
      } else {
        return <a onClick={houseAddBtn.bind(null, text)}>开启预约</a>
      }
   }
  }];

  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }
  const modaltemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    }
  }
  const tableProps = {
    columns: columns,
    dataSource: list,
    rowKey: 'houseId',
    loading: loading,
    pagination: {
      total: totalCount,
      showTotal: total => `共${totalCount}条`,
      current: currentPageNum
    },
    onChange: (pagination, filters) => {
      let search = form.getFieldsValue(['houseName', 'cityCode']);

      if (pagination.current == currentPageNum) {
        dispatch({ type: 'houseApptMng/getList', payload: { state: filters.state.join(), houseName: search.houseName, cityCode: search.cityCode } });
        dispatch({ type: 'houseApptMng/concat', payload: { currentPageNum: 1, state: filters.state.join() } });
      } else {
        dispatch({ type: 'houseApptMng/getList', payload: { currentPage: pagination.current, state: filters.state.join(), houseName: search.houseName, cityCode: search.cityCode } });
        dispatch({ type: 'houseApptMng/concat', payload: { currentPageNum: pagination.current } });
      }
    }
  }
  return (<div>
    <Form layout="inline">
      <FormItem label="楼盘名称" {...formItemLayout} className="mg-t20">
        {getFieldDecorator('houseName')(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="城市" {...formItemLayout} className="mg-t20">
        {getFieldDecorator('cityCode')(<Select style={{ width: 110 }} allowClear placeholder="请选择" notFoundContent="无数据">
          {cityList.map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
      </FormItem>
      <Button type="primary" icon="search" size="large" className="mg-t20 mg-l20" onClick={search}></Button>
      <Button icon="rollback" size="large" className="mg-t20 mg-l20" onClick={searchClear}></Button>
      <Table {...tableProps} className="mg-t20" />
      <Modal title="开启预约" visible={visible} onCancel={modalCancel} onOk={modalSubmit}>
        <FormItem label="预约开启时间" {...modaltemLayout} >
          {getFieldDecorator('time', { rules: [{ required: true, message: '请选择' }] })(<RangePicker />)}
        </FormItem>
      </Modal>
    </Form>
  </div>)
}


function mapStateToProps(state) {
  return {
    ...state.houseApptMng,
    loading: state.loading.models.houseApptMng
  };
}

HouseApptMng = Form.create()(HouseApptMng);

export default connect(mapStateToProps)(HouseApptMng);

