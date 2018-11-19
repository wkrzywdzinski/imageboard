(function() {
  new Vue({
    el: "#main",
    data: {
      header: "imageboard",
      respondarr: []
    },
    mounted: function() {
      console.log("mounted");
      var self = this;
      axios.get("/get-info").then(function(resp) {
        var respondarrfromserver = resp.data;
        self.respondarr = respondarrfromserver;
        console.log(self.respondarr);
        //mounted runs auto, res.json >>> axios takes results and sends to vue// then you assign value to value of info// you need empty array before
        /// name of database images ///
      });
    }
  });
})();
