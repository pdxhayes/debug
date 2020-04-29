import React from 'react'
import { Modal,Input,Form, Alert} from 'antd';
import _ from 'lodash'
import {t} from "../utils";

export default class AddAlbum extends React.Component{

  state = {
    title: '',
    description: '',
    loading: false,
    error: null,
  }


  componentDidMount() {

    const {album} = this.props

    if(album){
      this.setState({
        title: album.title,
        description: album.description
      })
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

    this.addAlbum();

  }

  addAlbum = () => {

    const {onAlbumSaved, album} = this.props
    const {title, description} = this.state
    

    const data = {
      title,
      description,
    }

    this.setState({
      loading: true,
      error: null
    }, () => {

      if(!album){
        window.dexpService.post('/dexp/albums', data).then((res) => {

          this.setState({
            loading: false,
            error: null,
          }, () => {
            if(onAlbumSaved){
              onAlbumSaved(res.data)
            }
          })
        }).catch(e => {
          console.log(e);

          this.setState({
            loading: false,
            error: _.get(e, 'response.data.error', e.toLocaleString())
          })
        })
      }else{

        data.uid = album.uid;

        window.dexpService.put(`/dexp/albums/${album.id}`, data).then((res) => {

          if(onAlbumSaved){
            onAlbumSaved(res.data)
          }

        }).catch(e => {
          this.setState({
            loading: false,
            error: _.get(e, 'response.data.error', e.toLocaleString())
          })

        })

      }


    })


  }

  handleOk = () => {
    this.addAlbum();
  }

  handleCancel = () => {
    const {handleCancel} = this.props
    if(handleCancel){
      handleCancel();
    }
  }




  render() {

    const {visible, album} = this.props;
    const {title, description,loading, error} = this.state;


    return (
      <div>
        <Modal
          confirmLoading={loading}
          title={album ? t('Edit Album') : t('Add new album')}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Form onSubmit={this.handleSubmit}>
            {error ? <Alert message={error} type="error" /> : null }
            <Form.Item>
              <Input name="title" onChange={this.handleOnChange} value={title} placeholder={t('Album title')} />
            </Form.Item>
            <Form.Item>
              <Input.TextArea name="description" onChange={this.handleOnChange} value={description} placeholder={t('Album description')} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

}
