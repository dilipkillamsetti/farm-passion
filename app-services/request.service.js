(function(){
    
  'use strict';
    angular.module('app').service(
            "requestService",
            function( $http, $q ) {

                return({
                    getRequest: getRequest,
                    postRequest: postRequest
                });

                // I get all of the friends in the remote collection.
                function getRequest(url) {

                    var getResponse = $http({
                      url: url,
                      method: "GET",
                      headers:{}
                    });

                    return( getResponse.then( handleSuccess, handleError ) );
                }


                function postRequest(url,data) {

                    var postResponse = $http({
                        url: url,
                        method: "POST",
                        data:data,
                        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                    return( postResponse.then( handleSuccess, handleError ) );
                }

                function handleError( response ) {

                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }

                    return( $q.reject( response.data.message ) );
                }

                function handleSuccess( response ) {
                    return( response.data );
                }
            }
        );

});