import React from 'react'
import {Badge} from "antd";
import _ from 'lodash'
import styled from 'styled-components'
import {t} from "../utils";
import Slideshow from "./slideshow";

const Container = styled.div `

.dexp-album-photos{
  display: flex;
  flex-direction: row;
  .dexp-photos-large-photo{
    flex-grow: 1;
    img{
      max-width: 100%;
      width: 100%;
      height: auto;
      max-height: 400px;
    }
  }
  .dexp-thumbnail-photos-thumbnails{
    position: relative;
    width: 250px;  
    height: 450px; 
    display: flex;
    overflow: hidden;
    flex-direction: column;
    img{
      max-width: 100%;
      max-height: 200px;
      
    }
  }
  
}
.dexp-photos-see-more{
  left: 0;
  text-align: center;
  position: absolute;
  bottom: 20px;
  right: 0;
  color: #FFF;
}

`


const MainImage = styled.div `
  margin-right: 5px;
  background: url("${props => props.img}") scroll 0 0 no-repeat;
  background-size: cover; 
  height: 445px;
  cursor: pointer;
`

const Thumbnail = styled.div `
  background: url("${props => props.img}") scroll 0 0 no-repeat;
  background-size: cover; 
  width: 220px;
  height: 220px;
  margin-bottom: 5px;
  cursor: pointer;
  &:last-child{
  margin-bottom: 0;
  }
`


export default class FormatterAlbum extends React.Component{

  state = {
    slideshow: false,
    active: 0,
  }

  render() {

    const {slideshow, active} = this.state
    const {album} = this.props


    const firstPhoto = _.get(album, 'photos[0]', null)
    const count = _.get(album, 'count', 0)

    const thumbnails = [];

    if(album.photos.length > 1){
      for (let i = 1; i < album.photos.length; i++) {
        thumbnails.push(album.photos[i])
      }
    }


    return (
      <Container className="dexp-photos-album">
        <div className="dexp-album-title">{album.title}  <Badge count={album.count} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} /></div>
        <div className="dexp-album-photos">
          {
            firstPhoto ? (
              <MainImage onClick={() => {

                this.setState({
                  slideshow: true,
                  active: 0
                })
              }} img={_.get(firstPhoto, 'file.preview', null)} className="dexp-photos-large-photo" />
            ) : null
          }
          {
            thumbnails.length ? (
              <div className="dexp-thumbnail-photos-thumbnails">
                {
                  thumbnails.map((item, index) => {
                    return (
                      <Thumbnail
                        onClick={() => {
                          this.setState({
                            slideshow: true,
                            active: index+1
                          })
                        }}
                        key={index} img={_.get(item, 'file.preview', null)} className="dexp-photos-thumbnail-item"/>
                    )
                  })
                }
                {
                  count - 3 > 0 ? (
                    <div className="dexp-photos-see-more">
                      {`${t('See')} ${count - 3} more photos`}
                    </div>
                  ): null
                }
              </div>
            ) : null
          }
        </div>
        {slideshow ? <Slideshow onExit={() => {
          this.setState({
            slideshow: false,
          })
        }} active={active} album={album}/> : null}
      </Container>
    )
  }
}
