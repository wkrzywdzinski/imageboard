(function() {
  Vue.component("showimage", {
    template: "#my-template",
    props: ["assignedid"],
    // prop takes property of parent
    data: function() {
      return {
        heading: "heading compo",
        title: "",
        description: "",
        username: "",
        url: ""
      };
    },
    mounted: function() {
      var self = this;
      axios.get("/get-picture/" + this.assignedid).then(function(resp) {
        self.url = resp.data.url;
        self.username = resp.data.username;
        self.description = resp.data.description;
        self.title = resp.data.title;
      });
    },
    methods: {
      closeemit: function() {
        this.$emit("closeimagebox");
      }
    }
  });

  new Vue({
    el: "#main",
    data: {
      header: "imageboard",
      images: [],
      imageid: 0,
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
      checkid: function() {
        this.imageid = event.currentTarget.id;
      },
      closecomponent: function() {
        this.imageid = null;
      },
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
          self.images.unshift(postrespfromserver);
        });
      },
      getmoreimages: function() {
        var self = this;
        var lastimageid = this.images[this.images.length - 1].id;
        axios.get("getmoreimages/" + lastimageid).then(function(resp) {
          self.images.push.apply(self.images, resp.data);
        });
      }
    }
  });
})();
