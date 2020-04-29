import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {Icon} from 'antd'

const Container = styled.div `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(134,134,134,1);
  z-index: 10000;
  display: flex;
  .dexp-photos-exit-fullscreen{
    color: #FFF;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .dexp-photos-slideshow-inner{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
  .dexp-photos-main-photo{
    padding: 10px;
    flex-grow: 1;
    height: calc(100% - 150px);
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }
  .dexp-photos-thumbnails{
     height: 110px;
     display: flex;
     justify-content: center;
     img{
        cursor: pointer;
        width: 100px;
        height: 100px;
        margin-left: 5px;
     }
  }
  .dexp-photos-slideshow-nav{
    cursor: pointer;
    padding: 5px;
    color: #FFF;
    left: 20px;
    top: 45%;
    position: absolute;
    &.dexp-photos-next{
      left: auto;
      right: 20px;
    }
    
  }
`

const Thumbnails = styled.div `
 overflow-y: hidden;
 overflow-x: auto;
 padding: 5px 5px 5px 0;
 width: ${props => props.width}px;
`

const ThumbImage = styled.img `
 
  opacity: ${props => props.active ? 0.7 : 1};

`

export default class Slideshow extends React.Component{

  state = {
    photos: [],
    active: 0,
    width: window.innerWidth,
  }


  componentDidMount() {

    const {album, active} = this.props
    document.addEventListener("keydown", this.onKeydown.bind(this), false);
    window.addEventListener('resize', this.onResize.bind(this))

    this.setState({
      photos: album.photos,
      width: window.innerWidth,
      active
    })


    window.dexpService.get(`/dexp/albums/${album.id}/photos`).then((res) => {
      this.setState({
        photos: res.data,
      })
    })
  }



  componentWillUnmount(){
    document.removeEventListener("keydown", this.onKeydown.bind(this), false);
    window.removeEventListener('resize', this.onResize.bind(this))
  }

  onResize(){
    this.setState({
      width: window.innerWidth
    })
  }

  onKeydown(event){

    if(event.keyCode === 27){
      this.handleExitFullScreen()
    }

    if(event.keyCode === 37){
      this.prev()
    }
    if(event.keyCode === 39){
      this.next()
    }
  }

  handleExitFullScreen(){
    const {onExit} = this.props
    if(onExit){
      onExit()
    }
  }

  prev(){
    const {active, photos} = this.state

    let value = active -1;
    if(active === 0){
      value = photos.length -1;

    }
    this.setState({
      active:value
    })
  }

  next(){
    const {active, photos} = this.state

    let value = active + 1;
    if(active === photos.length -1){
      value = 0;
    }
    this.setState({
      active:value
    })
  }

  render() {
    const {photos,active, width} = this.state
    const activePhoto = photos[active]

    return (
      <Container id="dex-photos-slideshow">
        <div className="dexp-photos-exit-fullscreen">
          <Icon width={50} onClick={() => {

            this.handleExitFullScreen();
          }} type="fullscreen-exit" />
        </div>
        <div onClick={() => {
          this.prev()
        }} className="dexp-photos-slideshow-nav dexp-photos-prev">
          <Icon width={50} type="left" />
        </div>
        <div onClick={() => {
          this.next()
        }} className="dexp-photos-slideshow-nav dexp-photos-next">
          <Icon width={50} type="right" />
        </div>
        <div className="dexp-photos-slideshow-inner">
          <div className="dexp-photos-main-photo">
            <img src={_.get(activePhoto, 'file.preview')} alt="" />

          </div>

          <Thumbnails width={width} className="dexp-photos-thumbnails">
            {
              photos.map((p, index) => {
                return (
                  <ThumbImage onClick={() => {
                    this.setState({
                      active:index
                    })
                  }} key={index} active={index === active} src={_.get(p, 'file.thumbnail')} />
                )
              })
            }
          </Thumbnails>

        </div>


      </Container>
    );
  }

}
