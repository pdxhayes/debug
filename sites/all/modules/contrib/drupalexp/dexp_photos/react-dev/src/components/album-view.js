import React from 'react'
import {PageHeader, Icon,Menu, Dropdown, Modal} from 'antd'
import styled from 'styled-components'
import AlbumPhotos from "./album-photos";
import AddAlbum from "./add-album";
import WidgetContext from '../context/widget-context'
import {t} from "../utils";

const {confirm} = Modal;
const Container = styled.div `


`

export default class AlbumView extends React.Component{

  state = {
    edit: false
  }

  render() {

    const {edit}  = this.state
    const {album, onBack} = this.props

    const menu = (
      <WidgetContext.Consumer>
        {
          context => (
            <Menu>
              <Menu.Item onClick={() => {


                this.setState({
                  edit: true
                })

              }}>
                <Icon type="edit" /> Edit
              </Menu.Item>

              <Menu.Item onClick={() => {
                confirm({
                  title: t('Delete album'),
                  content: t('Please confirm that you want to delete this album?'),
                  onOk() {
                    context.handleDeleteAlbum(album)
                  },
                  onCancel() {},
                })

              }}>
                <Icon type={t('delete')} /> Delete
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
            <Container className="dexp-album-details">

              <PageHeader
                onBack={() => {
                  if(onBack){
                    onBack()
                  }
                }}
                title={album.title}
                subTitle={album.description}
                tags={
                  <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link">
                      Actions <Icon type="ellipsis" />
                    </a>
                  </Dropdown>
                }
              />

              <AlbumPhotos albumId={album.id} photos={context.viewAlbum.photos ? context.viewAlbum.photos:[] }/>
              {
                edit && <AddAlbum
                  onAlbumSaved={(data) => {
                    this.setState({
                      edit: false,
                    })

                    context.onAlbumUpdated(data);
                  }}
                  handleCancel={() => {
                    this.setState({
                      edit: false
                    })
                  }}

                  visible album={album}/>
              }
            </Container>
          )
        }
      </WidgetContext.Consumer>
    )
  }
}
