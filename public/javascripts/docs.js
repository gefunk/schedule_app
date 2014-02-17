$(document).ready(function(){
   
    /*
        All Ports Section
    */
   $("a#get-ports").click(function(e){
       e.preventDefault();
       var ports_url = "http://schedules.amfitir.com/ports";
       $.getJSON(ports_url,
         function(data) {
               $( "div#port-result" ).html(  "<pre class='prettyprint lang-js'>"+JSON.stringify(data, null, 4)+"</pre>" );
               prettyPrint();
               $("button#clear-get-ports").show();
         });
   }); 
   
   $("button#clear-get-ports").click(function(e){
       $( "div#port-result" ).html( "results will be displayed here...." );
       $("button#clear-get-ports").hide();
   });
   
   /*
       Search for Ports
   */
   $("a#search-ports").click(function(e){
       e.preventDefault();
       var query = $("input#search-for-port").val();
       if(query.length <= 3){
           query = "USSAV";
       }
       var ports_url = "http://schedules.amfitir.com/ports/search/"+query;
       $.getJSON(ports_url,
         function(data) {
               $( "div#port-search-result" ).html(  "<pre class='prettyprint lang-js'>"+JSON.stringify(data, null, 4)+"</pre>" );
               prettyPrint();
               $("button#clear-search-ports").show();
         });
   }); 
   
   $("button#clear-search-ports").click(function(e){
       $( "div#port-search-result" ).html( "results will be displayed here...." );
       $("button#clear-search-ports").hide();
   });
   
   
   /*
       All Vessels Section
   */
  $("a#get-vessels").click(function(e){
      e.preventDefault();
      var vessels_url = "http://schedules.amfitir.com/vessels";
      $.getJSON(vessels_url,
        function(data) {
              $( "div#vessels-result" ).html(  "<pre class='prettyprint lang-js'>"+JSON.stringify(data, null, 4)+"</pre>" );
              prettyPrint();
              $("button#clear-get-vessels").show();
        });
  }); 
  
  $("button#clear-get-vessels").click(function(e){
      $( "div#vessels-result" ).html( "results will be displayed here...." );
      $("button#clear-get-vessels").hide();
  });
   
   
   
  /*
      Search for Ports
  */
  $("a#search-ports").click(function(e){
      e.preventDefault();
      var query = $("input#search-for-vessel").val();
      if(query.length <= 3){
          query = "MAERSK";
      }
      var vessels_url = "http://schedules.amfitir.com/vessels/search/"+query;
      $.getJSON(vessels_url,
        function(data) {
              $( "div#vessel-search" ).html(  "<pre class='prettyprint lang-js'>"+JSON.stringify(data, null, 4)+"</pre>" );
              prettyPrint();
              $("button#clear-search-ports").show();
        });
  }); 
  
  $("button#clear-search-vessel").click(function(e){
      $( "div#vessel-search-result" ).html( "results will be displayed here...." );
      $("button#clear-search-vessel").hide();
  }); 
});


