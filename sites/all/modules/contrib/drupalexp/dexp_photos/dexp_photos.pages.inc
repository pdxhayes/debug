<?php
require 'vendor/autoload.php';

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;


function dexp_endpoint($path) {

  return '/' . DEXP_ROOT_API . $path;
}

function dexp_photos_handle_rest() {

  global $user;

  $app = new Slim\App([
    "settings"  => [
      "determineRouteBeforeAppMiddleware" => true,
      'debug' => DEXP_DEBUG,
      'displayErrorDetails' => DEXP_DEBUG,
    ]
  ]);


  $app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
  });

  $app->add(function ($req, $res, $next) use ($user) {

    $route = $req->getAttribute('route');

    $path = $route->getPattern();

    if(!user_access('administer albums') && $user->uid !== 1){
      switch ($path){

        case dexp_endpoint('/albums'):

          if($req->isPost()){
            if(!user_access('create album')){
              return $res->withJson(['error' => 'Access denied'], 401);
            }
          }

          break;


        case dexp_endpoint('/albums/{id}'):

          if($req->isPut() || $req->isDelete()){
            // allow owner
            $id = $route->getArgument('id');

            $entity = dexp_photos_load_album($id);
            if(!$entity){
              return $res->withJson(['error' => 'Not found'], 404);
            }
            if($entity->uid !== $user->uid){

              return $res->withJson(['error' => 'Access denied'], 401);
            }

          }

          break;


        case dexp_endpoint('/albums/{id}/photos'):

          if($req->isPost()){
            if(!user_access('create album')){
              return $res->withJson(['error' => 'Access denied'], 401);
            }
          }

          break;


        case dexp_endpoint('/photos/{id}'):

          if($req->isPut() || $req->isDelete()){

            $photo = dexp_photos_load_photo($route->getArgument('id'));

            if(empty($photo)){
              return $res->withJson(['error' => 'Not found'], 404);
            }

            if($photo->uid !== $user->uid){
              return $res->withJson(['error' => 'Access denied'], 401);
            }

          }

          break;



        default:

          break;
      }
    }



    if(!DEXP_DEBUG){
      if($req->isPost() || $req->isPut() || $req->isDelete() || $req ->isPatch()){
        if($user->uid == 0){
          return $res->withJson(['error' => 'Access denied'], 401);
        }
      }


    }


    $response = $next($req, $res);
    return $response
      ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      ->withHeader('Access-Control-Allow-Credentials', 'true')
      ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
      ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  });


  /**
   * Root endpoint
   */
  $app->get(dexp_endpoint(''), function (ServerRequestInterface $request, ResponseInterface $response) {

    $data = ['version' => '1.0', 'copyright' => 'DrupalExp'];
    return $response->withJson($data, 200);

  });


  /**
   * Create album
   */
  $app->post(dexp_endpoint('/albums'), function (ServerRequestInterface $request, ResponseInterface $response) use ($user) {


    $body = $request->getParsedBody();

    if(empty($body['title'])){

      return $response->withJson(['error' => t('Album title is required')], 400);
    }

    $data = [
      'title'=> $body['title'],
      'description'=> $body['description'],
      'uid'=> $user->uid,
      'time' => REQUEST_TIME,
    ];

    try{
      $data['id'] = dexp_photos_create_album($data);
    }
    catch (Exception $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);

    }

    return $response->withJson($data, 200);

  });


  $app->get(dexp_endpoint('/albums'), function (ServerRequestInterface $request, ResponseInterface $response){

    $filter = json_decode($request->getQueryParam('filter'));
    $data = dexp_photos_get_albums(isset($filter) ? $filter : []);

    return $response->withJson($data, 200);


  });

  /**
   * Update album
   */

  $app->put(dexp_endpoint('/albums/{id}'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) {


    $body = $request->getParsedBody();

    try{
       dexp_photos_update_album($args['id'], $body);
    }
    catch (Exception $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);

    }
    return $response->withJson(dexp_photos_load_album($args['id']), 200);

  });



  /**
   * Delete albumn
   */
  $app->delete(dexp_endpoint('/albums/{id}'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) {

    try{
      $data = dexp_photos_delete_album($args['id']);
    }
    catch (Exception $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);

    }

    if(empty($data)){
      return $response->withJson(['error' => t('Album not found')], 404);
    }

    return $response->withJson(['success'=>$data], 200);

  });


  /**
   * Load album by ID
   */

  $app->get(dexp_endpoint('/albums/{id}'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) {


    try{
      $data = dexp_photos_load_album($args['id']);
    }
    catch (Exception $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);

    }

    if(empty($data)){
      return $response->withJson(['error' => t('Album not found')], 404);
    }
    return $response->withJson($data, 200);

  });


  /**
   * Get album photos
   */
  $app->get(dexp_endpoint('/albums/{id}/photos'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) {


    $limit = $request->getQueryParam('limit', 200);
    $skip = $request->getQueryParam('skip', 0);

    try{
      $data = dexp_photos_load_album_photos($args['id'], $limit, $skip);
    }
    catch (Exception $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);

    }

    return $response->withJson($data, 200);

  });


  /**
   * Upload photo to album
   */

  $app->post(dexp_endpoint('/albums/{id}/photos'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) use ($user) {


    $validators = [
      'file_validate_extensions' => ['jpg jpeg gif png'],
    ];

    //Save file
    $file = dexp_save_upload('', $validators, 'public://');


    if (empty($file)) {
      return $response->withJson(['error' => "An error uploading your photo."], 400);
    }



    $data = [
      'fid' => $file->fid,
      'album_id' =>$args['id'],
      'uid' => $user->uid,
      'title' => $file->filename,
      'description' => '',
      'created' => REQUEST_TIME,
      'file' => [
        'fid' => $file->fid,
        'filename' => $file->filename,
        'uri' => $file->uri,
        'thumbnail' => dexp_create_image_url($file->uri, 'thumbnail'),
        'preview' => dexp_create_image_url($file->uri),
        'filesize' => $file->filesize,
        'filemime' => $file->filemime,
      ]
    ];


    try{
      $id = dexp_photos_create_photo($data);
      $data['id'] = $id;

    }
    catch (ErrorException $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);
    }
    return $response->withJson($data, 200);

  });


  $app->put(dexp_endpoint('/photos/batch-update-weight'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) use ($user) {


    $body = $request->getParsedBody();

    if(empty($body)){
      return $response->withJson(['error' => t('No photo')], 400);
    }
    $items = [];

    foreach ($body as $b){
      $items[] = ['weight' => $b['weight'], 'id' => $b['id']];
    }


    try{
      $id = dexp_photos_update_photos_weight($items);

    }
    catch (ErrorException $exception){
      return $response->withJson(['error' => $exception->getMessage()], 400);
    }
    return $response->withJson(['success' => true], 200);

  });




  /**
   * Update photo
   */
  $app->put(dexp_endpoint('/photos/{id}'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) {

    $body = $request->getParsedBody();

    try{
      dexp_photos_update_photo($args['id'], $body);
    }catch (ErrorException $e){
      return $response->withJson(['error' => $e->getMessage()], 400);
    }
    return $response->withJson($body, 200);

  });


  /**
   * Delete photo
   */
  $app->delete(dexp_endpoint('/photos/{id}'), function (ServerRequestInterface $request, ResponseInterface $response,  array $args) {

    try{
      $deleted = dexp_photos_delete_photo($args['id']);
    }catch (ErrorException $e){
      return $response->withJson(['error' => $e->getMessage()], 400);
    }
    return $response->withJson(['success' => $deleted], 204);

  });



  //Cors
  $app->map([
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
  ], '/{routes:.+}', function ($req, $res) {
    $handler = $this->notFoundHandler; // handle using the default Slim page not found handler
    return $handler($req, $res);
  });


  $app->run();


}
