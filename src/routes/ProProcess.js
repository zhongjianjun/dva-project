import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Table, Col, Icon, Menu, Popconfirm, Dropdown, Modal, Select, Row, Badge, Upload, DatePicker, message } from 'antd';
import styles from './ProProcess.css';
import { getToken } from './../utils/util';
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const FormItem = Form.Item, Option = Select.Option;

function ProProcess(props) {

  let { dispatch, loading, form, list, totalCount, currentPageNum, cityList, state, visible, modalState, accessory, houseList, previewVisible, previewImage, imgId, proId, detailVisible, houseName, finishTime, remark, operateTime, operator } = props;

  function addBtn() {
    handleCancel();
    dispatch({ type: 'proProcess/concat', payload: { visible: true, modalState: true } });
  }

  function editBtn(val) {
    dispatch({ type: 'proProcess/concat', payload: { visible: true, modalState: false, proId: val.id } });
    dispatch({ type: 'proProcess/detail', payload: { id: val.id } });
    form.setFieldsValue({
      'city': {
        key: val.cityCode,
        label: val.cityName
      },
      'house': {
        key: val.houseId,
        label: val.houseName
      },
      'finishTime': moment(val.finishTime),
      'remark': val.remark
    });
  }

  function staChange(id, state) {
    dispatch({ type: 'proProcess/staChange', payload: { id, state } });
  }

  function proDel(id) {
    dispatch({ type: 'proProcess/proDel', payload: { id } });
  }

  function detailShow(id) {
    dispatch({ type: 'proProcess/concat', payload: { detailVisible: true } });
    dispatch({ type: 'proProcess/detail', payload: { id } });
  }

  function detailCancel() {
    dispatch({ type: 'proProcess/concat', payload: { detailVisible: false } });
  }

  function search() {
    let search = form.getFieldsValue(['searchHouse', 'searchCity', 'searchTime']);
    dispatch({ type: 'proProcess/getList', payload: { houseName: search.searchHouse, cityCode: search.searchCity, finishTime: search.searchTime ? search.searchTime.format("YYYY-MM-DD") : '' } });
    dispatch({ type: 'proProcess/concat', payload: { currentPageNum: 1 } });
  }

  function searchClear() {
    form.resetFields(["searchHouse", "searchCity", "searchTime"]);
    dispatch({ type: 'proProcess/getList' });
  }

  function cityChange(val) {
    form.resetFields(["house"]);
    dispatch({ type: 'proProcess/getHouseList', payload: { cityCode: val.key } });
  }

  function addImg() {
    if (accessory.length < 9) {
      var arr = [{
        id: imgId,
        imgUrl: '',
        imgRemark: ''
      }]
      dispatch({ type: 'proProcess/concat', payload: { accessory: accessory.concat(arr), imgId: (imgId + 1) } });
    } else {
      message.error('最多只添加9条数据');
    }
  }

  function delImg(id) {
    var arr = [];
    accessory.map((val, index) => {
      if (val.id !== id) {
        arr.push(val)
      }
    });
    dispatch({ type: 'proProcess/concat', payload: { accessory: arr } });
  }

  function uploadImg(id, img) {
    if (img.file.status === "done") {
      accessory.map((val, index) => {
        if (val.id == id) {
          val.imgUrl = img.file.response.data.key;
        }
      })
    }
    if (img.file.status === "removed") {
      accessory.map((val, index) => {
        if (val.id == id) {
          val.imgUrl = '';
        }
      })
    }
  }

  function uploadRemark(id) {
    accessory.map((val, index) => {
      if (val.id == id) {
        setTimeout(() => {
          val.imgRemark = form.getFieldValue(['imgRemark' + id]);
        }, 50)
      }
    })
  }

  function handleCancel() {
    form.resetFields(["city", "house", "finishTime", "remark"]);
    dispatch({ type: 'proProcess/concat', payload: { visible: false, accessory: [] } });
  }

  function previewCancel() {
    dispatch({ type: 'proProcess/concat', payload: { previewVisible: false } });
  }

  function handleSubmit() {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!accessory.length) {
        message.error("请添加图文说明");
        return;
      }
      let payload = {
        cityCode: values.city.key,
        cityName: values.city.label,
        houseId: values.house.key,
        houseName: values.house.label,
        state: 1,
        finishTime: values.finishTime.format('YYYY-MM-DD'),
        remark: values.remark,
        accessory
      }
      if (modalState) {
        dispatch({ type: 'proProcess/add', payload: payload });
      } else {
        payload.id = proId;
        dispatch({ type: 'proProcess/edit', payload: payload });
      }

    })
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
    dataIndex: 'operateTime',
    key: 'operateTime'
  }, {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator'
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
              <span onClick={detailShow.bind(null, text.id)}>查看 </span>
            </Menu.Item>
            <Menu.Item key="2">
              <Popconfirm title="确认下架？" onConfirm={staChange.bind(null, text.id, '3')}><span>下架</span></Popconfirm >
            </Menu.Item>
          </Menu>);
      } else {
        menu = (
          <Menu>
            <Menu.Item key="1">
              <span onClick={editBtn.bind(null, text)}>编辑</span>
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
      let search = form.getFieldsValue(['searchHouse', 'searchCity', 'searchTime']);
      if (pagination.current == currentPageNum) {
        dispatch({ type: 'proProcess/getList', payload: { state: filters.state.join(), houseName: search.searchHouse, cityCode: search.searchCity, finishTime: search.searchTime ? search.searchTime.format("YYYY-MM-DD") : '' } });
        dispatch({ type: 'proProcess/concat', payload: { currentPageNum: 1, state: filters.state.join() } });
      } else {
        dispatch({ type: 'proProcess/getList', payload: { currentPage: pagination.current, state: filters.state ? filters.state.join() : '', houseName: search.searchHouse, cityCode: search.searchCity, finishTime: search.searchTime ? search.searchTime.format("YYYY-MM-DD") : '' } });
        dispatch({ type: 'proProcess/concat', payload: { currentPageNum: pagination.current } });
      }
    }
  }
  const uploadProps = {
    action: "http://192.168.1.22:88/expand/upload-pic-qiniu",
    data: {
      token: getToken('userToken')
    },
    listType: "picture-card",
    onPreview: file => {
      dispatch({ type: 'proProcess/concat', payload: { previewVisible: true, previewImage: file.response.data.key } })
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
        {getFieldDecorator('searchTime')(<DatePicker placeholder="请选择" allowClear />)}
      </FormItem>
      <Button type="primary" icon="search" size="large" className="mg-t20 mg-l20" onClick={search}></Button>
      <Button icon="rollback" size="large" className="mg-t20 mg-l20" onClick={searchClear}></Button>
      <p className="mg-t20"><Button type="primary" icon="plus" size="large" onClick={addBtn} >新增进度</Button></p>
      <Table {...tableProps} className="mg-t20" />
      <Modal title={modalState ? '新增进度' : '编辑进度'} visible={visible} onCancel={handleCancel} onOk={handleSubmit}>
        <FormItem label="城市" {...modalItemLayout}>
          {getFieldDecorator('city', { rules: [{ required: true, message: '请选择' }], onChange: cityChange })(<Select disabled={modalState ? false : true} style={{ width: 152 }} labelInValue placeholder="请选择" notFoundContent="无数据">
            {cityList.map((val, index) => { return <Option value={val.areaCode} key={index}>{val.cityName}</Option> })}</Select>)}
        </FormItem>
        <FormItem label="楼盘" {...modalItemLayout}>
          {getFieldDecorator('house', { rules: [{ required: true, message: '请选择' }] })(<Select disabled={modalState ? false : true} style={{ width: 152 }} labelInValue placeholder="请选择" notFoundContent="无数据">
            {houseList.map((val, index) => { return <Option value={val.houseId} key={index}>{val.houseName}</Option> })}</Select>)}
        </FormItem>
        <FormItem label="交房时间" {...modalItemLayout}>
          {getFieldDecorator('finishTime', { rules: [{ required: true, message: '请选择' }] })(<DatePicker placeholder="请选择" />)}
        </FormItem>
        <FormItem label="说明" {...modalItemLayout}>
          {getFieldDecorator('remark', { rules: [{ required: true, message: '请选择' }] })(<Input type="textarea" placeholder="请输入工程进度说明" autosize={{ minRows: 3 }} />)}
        </FormItem>
        <FormItem label="图文说明" {...modalItemLayout}>
          <Button icon="upload" onClick={addImg}>点击添加</Button>
        </FormItem>
        {accessory.map((value, index) => {
          return <div className={styles.formBox} key={index}>
            <Icon type="close" className={styles.posClose} onClick={delImg.bind(null, value.id)} />
            <FormItem label="图片上传" {...modalItemLayout}>
              {getFieldDecorator('imgUrl' + value.id)(<Upload {...uploadProps} defaultFileList={value.imgUrl ? [{
                uid: value.id,
                name: '图片描述',
                status: 'done',
                url: value.imgUrl,
              }] : null} onChange={uploadImg.bind(null, value.id)} >{value.imgUrl ? null : uploadButton}</Upload>)}
            </FormItem>
            <FormItem label="图片说明" {...modalItemLayout}>
              {getFieldDecorator('imgRemark' + value.id, { rules: [{ required: true, message: '请输入' }], onChange: uploadRemark.bind(null, value.id), initialValue: value.imgRemark })(<Input type="textarea" placeholder="请输入图片说明" autosize={{ minRows: 1, maxRows: 3 }} />)}
            </FormItem>
          </div>
        })}
      </Modal>
      <Modal visible={previewVisible} footer={null} onCancel={previewCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal title="查看进度" visible={detailVisible} footer={null} onCancel={detailCancel}>
        <div className={styles.constont}>
          <Row><Col span={4}>楼盘：</Col><Col span={20}>{houseName}</Col></Row>
          <Row><Col span={4}>交房时间：</Col><Col span={20}>{finishTime}</Col></Row>
          <Row><Col span={4}>跟踪说明：</Col><Col span={20}>{remark}</Col></Row>
          {accessory.map((val, index) => {
            return <div key={index} className="mg-t20">
              <Row><Col span={4}>图片：</Col><Col span={20}><img src={val.imgUrl} className={styles.img} alt="图片描述" /></Col></Row>
              <Row><Col span={4}>图片说明：</Col><Col span={20}>{val.imgRemark}</Col></Row>
            </div>
          })}
          <Row><Col span={4}>操作人：</Col><Col span={20}>{operator}</Col></Row>
          <Row><Col span={4}>操作时间：</Col><Col span={20}>{operateTime}</Col></Row>
        </div>
      </Modal>
    </Form>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.proProcess,
    loading: state.loading.models.proProcess
  };
}

ProProcess = Form.create()(ProProcess);
export default connect(mapStateToProps)(ProProcess);
