import axios from 'axios'

export default class Service{

  constructor() {
    this.baseUrl = "";
    axios.defaults.withCredentials = true
  }

  setBaseUrl(url){

    let newUrl = '';
    if(url.length && url.charAt(url.length -1) === '/'){
      newUrl = url.slice(0, -1);
    }
    this.baseUrl = newUrl;
  }

  getUrl = (path) => {

    return `${this.baseUrl}${path}`
  }

  getBaseUrl(){

    return this.baseUrl
  }

  getOptions = () => {
    return {
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  get = (path, options = null) => {

    let config = options;

    if(config === null){
      config = this.getOptions()
    }
    return axios.get(this.getUrl(path), config)
  }

  post =  (path, data, options = null) => {

    let config = options;

    if(config === null){
      config = this.getOptions()
    }

    return axios.post(this.getUrl(path), data, config)
  }

  put = (path, data, options = null) => {

    let config = options;

    if(config === null){
      config = this.getOptions()
    }

    return axios.put(this.getUrl(path), data, config)
  }

  upload = (path, file, options = null) => {

  }

  delete = (path, options=null) => {

    let config = options;

    if(config === null){
      config = this.getOptions()
    }
    return axios.delete(this.getUrl(path), config)
  }

}
