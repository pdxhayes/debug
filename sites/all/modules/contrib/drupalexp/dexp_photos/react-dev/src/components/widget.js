import React from 'react'
import {notification} from 'antd'
import _ from 'lodash'
import arrayMove from "array-move";
import AddAlbum from "./add-album";
import AlbumView from "./album-view";
import AlbumGrid from "./album-grid";
import WidgetContext from '../context/widget-context'

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message
  });
};

export default class Widget extends React.Component{

  state = {
    showAddAlbum: false,
    viewAlbum: null,
    albums: [
    ],
  }


  componentDidMount() {

    const {albums} = this.props;

    this.setState({
      albums
    })

  }

  handleUpdateTextarea = () => {
    const {inputElement} = this.props
    const {albums} = this.state

    const albumIds = [];

    albums.forEach((a) => {
      albumIds.push(a.id)
    })
    
    inputElement.value = JSON.stringify(albumIds);

  }



  handleShowAddAlbumModal = () => {
    this.setState({
      showAddAlbum: true
    })
  }

  onAlbumSaved = (data) => {

    const {albums} = this.state

    this.setState({
      albums: [...albums, data],
      showAddAlbum: false
    }, () => {
      this.handleUpdateTextarea()
    })
  }

  onAlbumUpdated = (album) => {

    const {viewAlbum} = this.state

    if(viewAlbum.id === album.id){
      this.setState({
        viewAlbum: Object.assign(viewAlbum, album)
      })
    }

    const {albums} = this.state;

    albums.map((a) => {

      if(a.id === album.id){
        return Object.assign(a, album)
      }

      return a
    })

    this.setState({
      albums
    })
  }

  handleViewAlbum = (album) => {
    this.setState({
      viewAlbum: album
    })
  }

  handleDeleteAlbum = (album) => {

    let {albums} = this.state
     albums = albums.filter((i) => i.id !== album.id)

    this.setState({
      viewAlbum:null,
      albums
    }, () => {
      this.handleUpdateTextarea()
      window.dexpService.delete(`/dexp/albums/${album.id}`).catch((e) => {
        openNotificationWithIcon('error', 'Delete album error', _.get(e, 'response.data.error', e.toLocaleString()))
      })
    })
  }

  setAlbumPhotos = (items) => {

    const {viewAlbum, albums} = this.state
    viewAlbum.photos = items
    albums.map((i) => {

      if(i.id === viewAlbum.id){
        i.photos = items
      }

      return i
    })

    this.setState({
      viewAlbum,
      albums
    })

  }

  addPhotoToAlbum = (item) => {
    let {viewAlbum, albums} = this.state

    if(viewAlbum.id === item.album_id){
      if(!viewAlbum.photos){
        viewAlbum.photos = []
      }
      viewAlbum.photos = viewAlbum.photos.filter((i) => i.id !== item.id)

      const index = viewAlbum.photos.findIndex((i) => i.id === item.id)

      if(index === -1){
        viewAlbum.photos.push(item)
      }else{
        viewAlbum.photos[index] = item;
      }

    }

    albums = albums.map((i) => {

      if(i.id === viewAlbum.id){
        return viewAlbum
      }
      return i
    })

    this.setState({
      viewAlbum,
      albums
    })
  }

  handleDeletePhoto = (item) => {

    let {viewAlbum, albums} = this.state

    if(!viewAlbum.photos){
      viewAlbum.photos = []
    }

    viewAlbum.photos = viewAlbum.photos.filter((p) => p.id !== item.id);

    albums = albums.map((i) => {
      if(i.id === viewAlbum.id){
        return viewAlbum
      }
      return i
    })

    this.setState({
      viewAlbum,
      albums
    }, () => {

      window.dexpService.delete(`/dexp/photos/${item.id}`).catch((e) => {
        openNotificationWithIcon('error', 'Delete photo error', _.get(e, 'response.data.error', e.toLocaleString()))
      })
    })



  }

  handleBackToRoot = () => {

    this.setState({
      viewAlbum: false
    })
  }

  handleSortAlbums = (oldIndex, newIndex) => {
    this.setState(({albums}) => ({
      albums: arrayMove(albums, oldIndex, newIndex),
    }), () => {

      this.handleUpdateTextarea();
    })

  }

  render() {

    const {albums,showAddAlbum, viewAlbum} = this.state

    return (
      <WidgetContext.Provider value={{
        albums,
        viewAlbum,
        handleShowAddAlbumModal: this.handleShowAddAlbumModal,
        onAlbumSaved: this.onAlbumSaved,
        handleViewAlbum: this.handleViewAlbum,
        handleBackToRoot: this.handleBackToRoot,
        onAlbumUpdated: this.onAlbumUpdated,
        handleDeleteAlbum: this.handleDeleteAlbum,
        setAlbumPhotos: this.setAlbumPhotos,
        addPhotoToAlbum: this.addPhotoToAlbum,
        handleDeletePhoto: this.handleDeletePhoto,
        handleSortAlbums: this.handleSortAlbums
      }}>

        <div className="dexp-photos-widget">
          {viewAlbum ? <AlbumView onBack={() => {
            this.setState({
              viewAlbum: null
            })
          }} album={viewAlbum}/> : <AlbumGrid/>}

          {showAddAlbum ? <AddAlbum
            onAlbumSaved={this.onAlbumSaved}
            visible={showAddAlbum} handleCancel={() => {
            this.setState({
              showAddAlbum: false
            })
          }}/>: null}

        </div>

      </WidgetContext.Provider>
    );
  }

}
