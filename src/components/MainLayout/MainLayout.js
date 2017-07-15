import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './MainLayout.css';
import MainHeader from "./MainHeader.js";
import { routerRedux } from 'dva/router';
import { browserHistory } from 'react-router';
import { Link } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import { getToken } from './../../utils/util.js';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

function MainLayout(props) {
  let { dispatch, collapsed, mode, menuList,logStatus} = props;

  if (!menuList.length && logStatus) {
    dispatch({ type: 'mainLayout/getMenu' });
  }
  function onCollapse(collapsed) {
    props.dispatch({
      type: 'mainLayout/concat',
      payload: {
        collapsed,
        mode: collapsed ? 'vertical' : 'inline',
      }
    })
  }
  return (
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ minHeight: document.body.scrollHeight }} >
        <div className="logo"></div>
        <Menu theme="dark" mode={mode} >
          {menuList.map((value, index) => {
            return <SubMenu key={value.id} title={<span><Icon type="setting"></Icon><span className="nav-text">{value.name}</span></span>}>
              {value.children.map((val, indChildren) => {
                return <Menu.Item key={val.id}>
                  <Link to={'/' + val.url}>{val.name}</Link>
                </Menu.Item>
              })}
            </SubMenu>
          })}
        </Menu>
      </Sider>
      <Layout>
        <MainHeader />
        <Content className={styles.content}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(state) {
  return { ...state.mainLayout };
}
export default connect(mapStateToProps)(MainLayout);