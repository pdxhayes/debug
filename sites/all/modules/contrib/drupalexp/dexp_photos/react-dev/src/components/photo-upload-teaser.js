import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {Icon, Progress,Menu, Dropdown, Modal} from 'antd'
import WidgetContext from '../context/widget-context'
import EditPhoto from "./edit-photo";
import {t} from "../utils";

const {confirm} = Modal

const Container = styled.div `
  width: 104px;
  height: 104px;
  text-align: center;
  float: left;
  position: relative;
  overflow: hidden;
  margin: 5px;
  padding: 8px;
  background: ${props => props.error ? '#fff1f0' : 'none'};
  .preview-image{
    max-width: 100%;
  }
  .dexp-photo-grid-inner{
    height: 100%;
  }
   .dexp-photo-item-done{
    img{
      max-width: 100%;
      width: 100%;
      height: auto;
    }
   }
   .dexp-photo-action-hover{
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px;
    background: #FFF;
    display: none;
    z-index: 2;
   }
   
   &:hover, &.on-hover{
    .dexp-photo-action-hover{
      display: block;
    }
    .dexp-photo-grid-inner{
      &:before{
      content: '';
        position: absolute;
        background: rgba(0,0,0,0.3);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
      }
    }
   }
`

const ImageContainer = styled.div `
  display: flex;
  flex-grow: 1;
  text-align: center;
  justify-content: center;

`
export default class PhotoUploadTeaser extends React.Component{

  state = {
    hover: false,
    modal: false,
    editPhoto: false
  }

  render() {
    const {hover, modal,editPhoto} = this.state
    const {photo,onDelete,onSave} = this.props


    const filename = _.get(photo, 'response.title', photo.name)
    const error = _.get(photo, 'status') === 'error'
    const menu = (
     <WidgetContext.Consumer>
       {
         context => (
           <Menu>
             {
               photo.status === 'done' && <Menu.Item onClick={() => {

                 this.setState({
                   editPhoto: true,
                 })
               }}>
                 <Icon type="edit" /> Edit
               </Menu.Item>
             }
             <Menu.Item onClick={() => {

               confirm({
                 title: t('Delete photo'),
                 content: t('Please confirm that you want to delete this picture?'),
                 onOk() {

                   if(onDelete){
                     onDelete(photo)
                   }
                   if(photo.response){
                     context.handleDeletePhoto(photo.response)
                   }


                 },
                 onCancel() {},
               })



             }}>
               <Icon type="delete" /> Delete
             </Menu.Item>
           </Menu>
         )
       }
     </WidgetContext.Consumer>
    );


    return (
      <WidgetContext.Consumer>
        {
          context => (
            <Container error={error} className={`dexp-photo-widget-grid ${hover ? 'on-hover' : ' no-hover'}`}>
              <div className="dexp-photo-action-hover">
                <Dropdown
                  onVisibleChange={(f) => {
                    this.setState({hover: f})
                  }} overlay={menu}>
                  <a className="ant-dropdown-link">
                    <Icon type="ellipsis" />
                  </a>
                </Dropdown>
              </div>
              <div onClick={() => {
                if(photo.status==='done'){
                  this.setState({modal: true})
                }

              }} className="dexp-photo-grid-inner">
                {
                  photo.status === 'uploading' && <div className="dexp-photo-item-uploading">
                    <Progress width={80} type="circle" percent={_.get(photo, 'percent')} />

                  </div>
                }
                {
                  photo.status === 'done' && <div className="dexp-photo-item-done">
                    <img src={_.get(photo, 'response.file.thumbnail')} alt={photo.response.title} />
                  </div>
                }
                { photo.status === 'error' && <div>Upload error</div> }
                <div className="filename">{filename}</div>
              </div>

              <Modal
                width="90%"
                centered
                visible={modal}
                title={filename}
                onCancel={() => {

                  this.setState({
                    modal: false
                  })
                }}
                footer={null}
              >
                <ImageContainer className="image-preview-container">
                  <img style={{maxWidth: '100%'}} className="preview-image" src={_.get(photo, 'response.file.preview')} alt="" />
                </ImageContainer>
              </Modal>

              {editPhoto ? <EditPhoto
                onSave={({title,description}) => {

                  let data = photo;
                  data.response.title = title;
                  data.response.description = description;

                  window.dexpService.put(`/dexp/photos/${photo.response.id}`, data.response);



                  if(onSave){
                    onSave(data)
                  }

                }}
                handleCancel={() => {
                  this.setState({
                    editPhoto: false
                  })
                }}
                visible photo={photo}/>: null }

            </Container>
          )
        }
      </WidgetContext.Consumer>
    )
  }
}
