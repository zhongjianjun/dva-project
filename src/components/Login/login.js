import React from "react";
import { connect } from 'dva';
import { Form, Icon, Input, Button, Select } from "antd";
import img from './logo.png';
import styles from "./login.css";
const FormItem = Form.Item;
const Option = Select.Option;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!this.state.isShow && !this.props.form.getFieldValue("tenantNumber")) {
        this.props.form.setFields({
          tenantNumber: {
            errors: [new Error("请输入企业标识")]
          }
        });
        return;
      }
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type: this.state.isShow
        }
      })
    });
  }
  onChange = (val) => {
    if (val === "1") {
      this.setState({
        isShow: true
      });
    }
    if (val === "2") {
      this.setState({
        isShow: false
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.login}>
        <div className={styles.layout}>
          <img src={img} title="logo" alt="logo" className={styles.logo} />
          <div className={styles.content}>
            <h1 className={styles.title}>登录服务产品</h1>
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator("mobile", {
                  rules: [{ required: true, message: "请输入用户名" }]
                })(<Input prefix={<Icon type="user" />} placeholder="用户名" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "请输入密码" }]
                })(
                  <Input
                    prefix={<Icon type="lock" />}
                    type="password"
                    placeholder="密码"
                  />
                  )}
              </FormItem>
              <span hidden={this.state.isShow}>
                <FormItem>
                  {getFieldDecorator("tenantNumber")(
                    <Input
                      prefix={<Icon type="key" />}
                      type="password"
                      placeholder="企业标识"
                    />
                  )}
                </FormItem>
              </span>
              <FormItem>
                <Select onChange={this.onChange} defaultValue="1">
                  <Option value="1">企业账户</Option>
                  <Option value="2">普通账户</Option>
                </Select>
              </FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.props.loading}
                className={styles.button}
              >
                登录
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
Login = Form.create()(Login);



function mapStateToProps(state) {
  const { loading } = state.login;
  return {
    loading: state.loading.models.login,
  };
}
export default connect(mapStateToProps)(Login);

