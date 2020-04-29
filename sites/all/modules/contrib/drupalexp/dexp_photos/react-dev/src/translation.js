export default class Translation{
  constructor(){
    this.drupal = null;
  }

  setDrupal(Drupal){
    this.drupal = Drupal
  }

  t(text){
    return this.drupal.t(text)
  }
}
