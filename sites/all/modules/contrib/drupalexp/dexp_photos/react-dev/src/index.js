import "antd/dist/antd.css"
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import * as serviceWorker from './serviceWorker'
import Widget from "./components/widget"

import Service from "./service"
import Formatter from "./components/formatter"
import Translation from "./translation"

const translation = new Translation()
window.dexpService = new Service()
window.dexpTranslate = translation;


window.dexpRenderWidget = (data, Drupal) => {

  window.dexpTranslate.setDrupal(Drupal);

  _.each(data, (item, key) => {
    const textAreaElement = document.getElementById(`${item.id}-textarea`)
    ReactDOM.render(<Widget key={key} inputElement={textAreaElement} albums={item.albums}/>,  document.getElementById(item.id));
  })

};




window.dexpRenderFormatter = (data, Drupal) => {

  window.dexpTranslate.setDrupal(Drupal);

  _.each(data, (item, key) => {
    ReactDOM.render(<Formatter key={key} albums={item.albums}/>,  document.getElementById(item.id));
  });


}

serviceWorker.unregister();
