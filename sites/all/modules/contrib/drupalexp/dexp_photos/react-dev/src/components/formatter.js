import React from 'react'
import styled from 'styled-components'
import {Badge} from 'antd'
import FormatterAlbum from "./formatter-album";

const Container = styled.div `



`


export default class Formatter extends React.Component {

  render(){

    const {albums} = this.props


    return (
      <Container className="dex-photos-formatter">
        {
          albums.map((album, key) => {
           return <FormatterAlbum key={key} album={album}/>
          })
        }

      </Container>
    )
  }
}
