import React from 'react'
import { Card } from 'antd';
import styled from 'styled-components'
import _ from 'lodash'

const {Meta} = Card

const Container = styled.div `
  padding: 5px;
  img{
      max-height: 150px;
    
  }
  
 
`
const Placeholder = styled.div `
  background: rgba(0,0,0,0.02);
  min-height: 150px;
`
export default class Album extends React.Component{


  render() {

    const {album} = this.props

    const coverImage = _.get(album,  'photos[0].file.preview')
    return (
      <Container className="dexp-photos-album">
        <Card
          size="small"
          hoverable
          cover={coverImage ? <img alt={album.title} src={coverImage} /> : <Placeholder />}
        >
          <Meta
            title={album.title}
            description={album.description}
          />
        </Card>

      </Container>
    )
  }
}
