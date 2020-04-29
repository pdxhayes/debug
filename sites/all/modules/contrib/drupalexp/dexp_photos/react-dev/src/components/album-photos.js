import React from 'react'
import { Upload, Icon, Modal } from 'antd';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import styled from 'styled-components'
import _ from 'lodash'
import WidgetContext from '../context/widget-context'
import PhotoUploadTeaser from "./photo-upload-teaser";

const SortList = styled.div `
  display: table;
  float: left;
  
`
export default class AlbumPhotos extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    photos:[],
  };


  componentDidMount() {

    let {photos, albumId} = this.props
    if(photos.length){
      photos = photos.map((i) => {
        return {
          uid: i.id,
          status: 'done',
          response: i
        }
      })

      this.setState({
        photos
      })
    }


    window.dexpService.get(`/dexp/albums/${albumId}/photos`).then((res) => {

      const items = [];

      _.each(res.data, (d) => {

        items.push({
          uid: d.id,
          status: 'done',
          response: d
        })

      })

      this.setState({
        photos: items
      })
    })

  }

  handleChange = ({ file }, context)  => {

    const {photos} = this.state

    const _index = photos.findIndex((p) => p.uid === file.uid);

    if(_index !== -1){
      photos[_index] = file
    }else{
      photos.push(file)
    }

    this.setState({ photos})

    if(file.status === 'done'){
      context.addPhotoToAlbum(_.get(file, 'response'))
    }

  }


  onSortEnd = ({oldIndex, newIndex}, context) => {


    this.setState(({photos}) => ({
      photos: arrayMove(photos, oldIndex, newIndex),
    }), () => {

      const updates = [];

      const photos = []

      this.state.photos.forEach((p, i) => {
        updates.push({
          id: _.get(p, 'response.id'),
          weight: i
        })

        photos.push(_.get(p, 'response'))
      })

      window.dexpService.put('/dexp/photos/batch-update-weight', updates);
      context.setAlbumPhotos(photos);
      
    });
  };



  render() {

    let {photos} = this.state


    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );


    const baseUrl = window.dexpService.getBaseUrl()

    const SortableItem = SortableElement(({value}) => (


      <PhotoUploadTeaser
        onSave={(photo) => {

          const index = photos.findIndex((p) => p.response.id === photo.id)
          if(index !== -1){
            photos[index] = photo
          }
          this.setState({
            photos
          })
        }}
        onDelete={(ph) => {

        photos = photos.filter((p ) => p.uid !== ph.uid)


        this.setState({photos})

      }} photo={value}/>
    ));

    const SortableList = SortableContainer(({items}) => {
      return (
        <SortList className="dexp-photos-grid">
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
        </SortList>
      );
    });



    return (
      <WidgetContext.Consumer>
        {

          context => (

            <div className="clearfix">
              <SortableList
                distance={5}
                axis="xy" items={photos} onSortEnd={(value) => this.onSortEnd(value, context)} />

              <Upload
                withCredentials
                name="files"
                multiple
                showUploadList={false}
                action={`${baseUrl}/dexp/albums/${context.viewAlbum.id}/photos`}
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={(value) => this.handleChange(value, context)}
              >
                {uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          )
        }
      </WidgetContext.Consumer>
    );
  }
}
