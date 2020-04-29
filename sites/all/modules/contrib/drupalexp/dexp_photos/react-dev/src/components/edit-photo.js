import React from 'react'
import {Alert, Modal,Input,Form} from "antd";
import {t} from "../utils";

export default class EditPhoto extends React.Component{

  state = {
    loading: false,
    error: null,
    title: '',
    description: '',
  }

  componentDidMount() {


    const {photo} = this.props

    const {title, description} = photo.response;
    this.setState({
      title,
      description
    })
  }

  handleOk = () => {
    this.save();
  }

  handleCancel = () => {
    const {handleCancel} = this.props
    if(handleCancel){
      handleCancel();
    }
  }


  handleOnChange = (e) => {
    const {name} = e.target;
    const {value} = e.target;

    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.save();

  }

  save = () => {
    const {title, description} = this.state
    const {onSave} = this.props

    if(onSave){
      onSave({title, description})
    }


  }


  render(){

    const {visible} = this.props
    const {loading,error, title, description} = this.state

    return (
      <Modal
        confirmLoading={loading}
        title={t('Edit photo')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Form onSubmit={this.handleSubmit}>
          {error ? <Alert message={error} type="error" /> : null }
          <Form.Item>
            <Input name="title" onChange={this.handleOnChange} value={title} placeholder={t('Photo title')} />
          </Form.Item>
          <Form.Item>
            <Input.TextArea name="description" onChange={this.handleOnChange} value={description} placeholder={t('Photo description')} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
