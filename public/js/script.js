(function() {
  new Vue({
    el: "#main",
    data: {
      header: "imageboard",
      images: [],
      form: {
        title: "",
        description: "",
        username: "",
        file: null
      }
    },
    mounted: function() {
      var self = this;
      /////////scope//////////
      axios.get("/get-info").then(function(resp) {
        let getrespfromserver = resp.data;
        self.images = getrespfromserver;
      });
    },
    methods: {
      handleFileChange: function(e) {
        this.form.file = e.target.files[0];
      },
      uploadFile: function(e) {
        var self = this;
        e.preventDefault();
        // use formdata to uplad file to server//
        var formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("description", this.form.description);
        formData.append("username", this.form.username);
        formData.append("file", this.form.file);
        axios.post("/upload", formData).then(function(resp) {
          let postrespfromserver = resp.data[0];
          console.log(postrespfromserver);
          self.images.push(postrespfromserver);
        });
      }
    }
  });
})();
