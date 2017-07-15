import React, { Component } from 'react';
import styles from './SearchInput.css';
import { connect } from 'dva';
import { Select } from 'antd';
import { browserHistory } from 'dva/router';
import { routerRedux } from 'dva/router';
import { getToken } from './../../utils/util.js';

function SearchInput(props) {
  let { dispatch, houseList, mode, list, value, defaulSelectedKey } = props;
  function handleChange(value) {
      console.log(value);
      // const houseName = value.label,
        // houseId = value.key;
      // dispatch({ type: 'handleApptCstmMng/getHouseName', payload: { houseName, houseId } });
  }
  const options = list.map(d => <Option key={d.value}>{d.text}</Option>);
  return (
    <Select
      mode
      value={value}
      notFoundContent=""
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onChange={handleChange}
      labelInValue
    >
      {options}
    </Select>
  )
}

export default SearchInput;
