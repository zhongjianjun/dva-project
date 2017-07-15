
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Table, Col, Icon, Menu, Popconfirm, Dropdown, Modal, Select, Row, Badge, Upload } from 'antd';
import styles from './EngProcess.css';
import { getToken } from './../utils/util';
const FormItem = Form.Item, Option = Select.Option;

function EngProcess(props) {

  let { dispatch, loading, form, list, totalCount, currentPageNum, cityList, state, visible, modalState, imgList } = props;

  function addBtn(val) {
    dispatch({ type: 'engProcess/concat', payload: { visible: true, modalState: true } });
  }

  function editBtn(val) {
    dispatch({ type: 'engProcess/concat', payload: { visible: true, modalState: false } });
  }

  function staChange(id, state) {
    dispatch({ type: 'engProcess/staChange', payload: { id, state } });
  }

  function proDel(id) {
    dispatch({ type: 'engProcess/proDel', payload: { id } });
  }


  function search() {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({ type: 'engProcess/getList', payload: { houseName: values.houseName, cityCode: values.cityCode } });
    })
  }

  function searchClear() {
    form.setFieldsValue({
      searchHouse: '',
      searchCity: '',
      searchTime
    })
    dispatch({ type: 'engProcess/getList' });
  }

  function addImg() {
    const arr = imgList;
    arr.push(arr.length);
    dispatch({ type: 'engProcess/concat', payload: { imgList: arr } });
  }

  function handleCancel() {
    dispatch({ type: 'engProcess/concat', payload: { visible: false } });
  }

  function handleSubmit() {

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
    title: '城市',
    dataIndex: 'cityName',
    key: 'cityName',
  }, {
    title: '交房时间',
    dataIndex: 'finishTime',
    key: 'finishTime',

  }, {
    title: '更新时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime'
  }, {
    title: '操作人',
    dataIndex: 'modifyPeople',
    key: 'modifyPeople'
  }, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    filters: [{
      text: '未发布',
      value: '1',
    }, {
      text: '已发布',
      value: '2',
    }, {
      text: '已下架',
      value: '3',
    }],
    filterMultiple: false,
    render: text => {
      return <span><Badge status={text == 1 ? 'error' : text == 2 ? 'success' : 'default'} />{text == 1 ? '未发布' : text == 2 ? '已发布' : '已下架'}</span>
    }
  }, {
    title: '操作',
    render: text => {
      let menu = {};
      if (text.state == 2) {
        menu = (
          <Menu>
            <Menu.Item key="1">
              <span >查看 </span>
            </Menu.Item>
            <Menu.Item key="2">
              <Popconfirm title="确认下架？" onConfirm={staChange.bind(null, text.id, '3')}><span>下架</span></Popconfirm >
            </Menu.Item>
          </Menu>);
      } else {
        menu = (
          <Menu>
            <Menu.Item key="1">
              <span>编辑 </span>
            </Menu.Item>
            <Menu.Item key="2">
              <Popconfirm title="确认发布？" onConfirm={staChange.bind(null, text.id, '2')}><span>发布</span></Popconfirm >
            </Menu.Item>
            <Menu.Item key="3">
              <Popconfirm title="确认删除？" onConfirm={proDel.bind(null, text.id)}><span>删除</span></Popconfirm >
            </Menu.Item>
          </Menu>);
      }

      return <Dropdown overlay={menu}>
        <Button icon="bars">
          <Icon type="down" />
        </Button>
      </Dropdown>
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
  const modalItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 18
    }
  }
  const tableProps = {
    columns: columns,
    dataSource: list,
    rowKey: 'id',
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

  const uploadProps = {
    action: "http://192.168.1.25:83/expand/upload-pic-qiniu",
    data: {
      token: getToken('userToken')
    },
    fileList: [],
    listType: "picture-card",
    onPreview: file => {

    },
    onChange: val => {

    },
    beforeUpload: file => {
      if (file.size / 1024 / 1024 > 5) {
        message.error("上传的图片大小不超过5M");
        return false;
      }
    },
    multiple: false,
    name: "img",
    accept: "image/jpeg,image/jpg,image/png,image/gif"
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  return (<div>
    <Form layout="inline">
      <FormItem label="楼盘名称" {...formItemLayout} className="mg-t20">
        {getFieldDecorator('searchHouse')(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="城市" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="mg-t20">
        {getFieldDecorator('searchCity')(<Select style={{ width: 110 }} allowClear placeholder="请选择" notFoundContent="无数据">
          {cityList.map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
      </FormItem>
      <FormItem label="交房时间" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} className="mg-t20 mg-l20">
        {getFieldDecorator('searchTime')(<Select style={{ width: 110 }} allowClear placeholder="请选择">
          {[].map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
      </FormItem>
      <Button type="primary" icon="search" size="large" className="mg-t20 mg-l20" onClick={search}></Button>
      <Button icon="rollback" size="large" className="mg-t20 mg-l20" onClick={searchClear}></Button>
      <p className="mg-t20"><Button type="primary" icon="plus" size="large" onClick={addBtn} >新增进度</Button></p>
      <Table {...tableProps} className="mg-t20" />
      <Modal title={modalState ? '新增进度' : '编辑进度'} visible={visible} onCancel={handleCancel} onOk={handleSubmit}>
        <FormItem label="城市" {...modalItemLayout}>
          {getFieldDecorator('city', { rules: [{ required: true, message: '请选择' }] })(<Select style={{ width: 110 }} labelInValue placeholder="请选择" notFoundContent="无数据">
            {cityList.map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
        </FormItem>
        <FormItem label="楼盘" {...modalItemLayout}>
          {getFieldDecorator('house', { rules: [{ required: true, message: '请选择' }] })(<Select style={{ width: 110 }} labelInValue placeholder="请选择" notFoundContent="无数据">
            {cityList.map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
        </FormItem>
        <FormItem label="交房时间" {...modalItemLayout}>
          {getFieldDecorator('finishTime', { rules: [{ required: true, message: '请选择' }] })(<Select style={{ width: 110 }} labelInValue placeholder="请选择" notFoundContent="无数据">
            {cityList.map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
        </FormItem>
        <FormItem label="说明" {...modalItemLayout}>
          {getFieldDecorator('remark', { rules: [{ required: true, message: '请选择' }] })(<Input type="textarea" placeholder="请输入工程进度说明" autosize={{ minRows: 3 }} />)}
        </FormItem>
        <FormItem label="图文说明" {...modalItemLayout}>
          <Button size="omitted" icon="upload" onClick={addImg}>点击添加</Button>
        </FormItem>
        {imgList.map((value, index) => {
          return <div className={styles.formBox}>
            <FormItem label="图片上传" {...modalItemLayout}>
              {getFieldDecorator('imgUrl', { rules: [{ required: true, message: '请选择图片' }] })(<Upload {...uploadProps}>{uploadButton} </Upload>)}
            </FormItem>
            <FormItem label="图片说明" {...modalItemLayout}>
              {getFieldDecorator('imgRemark', { rules: [{ required: true, message: '请输入' }] })(<Input type="textarea" placeholder="请输入图片说明" autosize={{ minRows: 1, maxRows: 3 }} />)}
            </FormItem>
          </div>
        })}

      </Modal>
    </Form>
  </div>)
}


function mapStateToProps(state) {
  return {
    ...state.engProcess,
    loading: state.loading.models.engProcess
  };
}

EngProcess = Form.create()(EngProcess);

export default connect(mapStateToProps)(EngProcess);

