import React from 'react'
import {Icon} from "antd";
import styled from "styled-components";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import Album from "./album";
import WidgetContext from '../context/widget-context'

const AddAlbumContainer = styled.div `
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  align-content: center;
  padding: 20px;
  float: left;
  width: 200px;
  height: 220px;
`

const Container = styled.div `
  display: table;
  &:before, &:after{
    clear: both;
    content: '';
  }
  .ant-card-cover{
    min-height: 150px;
  }
  
`

const Row = styled.div `
  float: left;
  display: table;
  &:before, &:after{
    clear: both;
    content: '';
  }
 
`
const Col = styled.div `
 margin-bottom: 10px;
 float: left;
 width: 200px;
 height: 220px;
`

export default class AlbumGrid extends React.Component{



  onSortEnd = ({oldIndex, newIndex}, context) => {
    context.handleSortAlbums(oldIndex, newIndex)
  }

  render() {



    const SortableItem = SortableElement(({album, context}) => (
      <Col onClick={() => context.handleViewAlbum(album)} span={3}><Album album={album} /></Col>
    ));

    const SortableList = SortableContainer(({items, context}) => {
      return (
        <Row type="flex" justify="start" className="dexp-photos-grid">
          {items.map((value, index) => (
            <SortableItem context={context} key={`item-${index}`} index={index} album={value} />
          ))}
        </Row>
      );
    });



    return (
      <WidgetContext.Consumer>
        {
          context => (
            <Container type="flex" justify="start" className="dexp-photos-grid-container">
              <SortableList
                context={context}
                distance={5}
                axis="xy" items={context.albums} onSortEnd={(value) => this.onSortEnd(value, context)} />
              <AddAlbumContainer  onClick={context.handleShowAddAlbumModal}>
                <Icon type="plus" />
                <div>Create album</div>
              </AddAlbumContainer>
            </Container>
          )
        }

      </WidgetContext.Consumer>
    )
  }
}
