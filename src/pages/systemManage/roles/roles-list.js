import React, { Component } from 'react';
import LinkBtn from '../../../components/link-btn';
import { reqRoleQuery } from '../../../api/role';
import { Divider, Table, Form, Row, Col, Input, Button } from 'antd';
import '../../../assets/css/list.less';

/*
* 用户管理
 * */
class RolesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query: {
        pageSize: 10,
        pageNum: 1
      },
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {},
      dataList: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          render: text => <LinkBtn>{text}</LinkBtn>
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
        },
        {
          title: '操作',
          render: (text, record) => (
            <span>
              <LinkBtn onClick={() => this.updateClick(record.uuid)}>修改</LinkBtn>
              <Divider type="vertical" />
              <LinkBtn onClick={() => this.deleteClick(record.uuid)}>删除</LinkBtn>
            </span>
          ),
        },
      ],
      params: {

      }
    };
    this.updateClick = this.updateClick.bind(this);
  };
  /*
  * 调用后台用户列表接口
  * */
  fetch = () => {
    this.setState({ loading: true });
    let params = this.state.params;
    reqRoleQuery(params).then(res => {
      if (res.data.code === 1) {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.data.total;
        this.setState({
          loading: true,
          dataList: res.data.data,
          pagination,
        })
      }
    });
  };
  /*
  * 分页回调事件
  * */
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
    let params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current
    };
    this.setState({
      params: params
    }, () => {
      this.fetch();
    });
  };
  handleAdd () {
    console.log(this)
    this.props.history.push({
      pathname: '/home/roles/add',
      state: {
        type: 1
      }
    })
  };
  /*
  * 修改按钮
  * */
  updateClick (uuid) {
    this.props.history.push({
      pathname: '/home/roles/add',
      query: {
        type: 2,
        uuid
      }
    })
  };
  /*
  * 删除按钮
  * */
  deleteClick (uuid) {
    alert(uuid)
  };
  /*
  * 在渲染前调用异步请求
  * */
  componentWillMount () {
    this.fetch()
  };
  handleSearch = e => {
    e.preventDefault();
    console.log(this.state.params)
  };

  render () {
    // 列表复选框
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows
        })
      }
    };
    return (
      <div>
        <Form className="ant-advanced-search-form">
          <Row type="flex">
            <Col span={3} key="1">
              <Form.Item label="姓名">
                <Input
                  placeholder="请输入姓名"
                />
              </Form.Item>
            </Col>
            <Col className="ant-advanced-search-form-btns">
              <Button type="primary" onClick={this.handleSearch}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <div className="table-list">
          <Row className="operation-btns">
            <Button type="primary" onClick={this.handleAdd.bind(this)}>新增</Button>
          </Row>
          <Table
            rowKey="uuid"
            dataSource={this.state.dataList}
            columns={this.state.columns}
            pagination={this.state.pagination}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default RolesList
