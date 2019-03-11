(function() {
  new Vue({
    el: "#main",
    data: {
      images: [],
      imageid: location.hash.slice(1) || 0,
      moreimages: true,
      form: {
        title: "",
        description: "",
        username: "",
        file: null
      }
    },
    mounted: function() {
      var self = this;
      axios.get("/get-info").then(function(resp) {
        self.images = resp.data;
      });
      // shows right picture if user puts id of pic in url //
      window.addEventListener("hashchange", function() {
        self.imageid = location.hash.slice(1);
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
        var formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("description", this.form.description);
        formData.append("username", this.form.username);
        formData.append("file", this.form.file);
        axios.post("/upload", formData).then(function(resp) {
          self.images.unshift(resp.data[0]);
        });
      },
      getmoreimages: function() {
        var self = this;
        self.lastid = self.images[self.images.length - 1].id;
        if (self.lastid == 1) {
          this.moreimages = false;
        }
        axios.get("get-more-images/" + self.lastid).then(function(resp) {
          self.images.push.apply(self.images, resp.data);
        });
      }
    }
  });
  /////////////BIGGER IMAGE COMPONENT///////////////
  Vue.component("biggerimage", {
    template: "#biggertemplate",
    props: ["assignedid"],
    data: function() {
      return {
        comments: [],
        title: "",
        description: "",
        username: "",
        url: "",
        form: {
          comment: "",
          commentusername: ""
        }
      };
    },
    watch: {
      assignedid: function() {
        var self = this;
        axios.get("/get-picture/" + this.assignedid).then(function(resp) {
          self.url = resp.data[0].url;
          self.username = resp.data[0].username;
          self.description = resp.data[0].description;
          self.title = resp.data[0].title;
          self.comments = resp.data;
        });
      }
    },
    mounted: function() {
      var self = this;
      axios.get("/get-picture/" + this.assignedid).then(function(resp) {
        self.url = resp.data[0].url;
        self.username = resp.data[0].username;
        self.description = resp.data[0].description;
        self.title = resp.data[0].title;
        self.comments = resp.data;
      });
    },
    methods: {
      uploadcomment: function(e) {
        e.preventDefault();
        var self = this;
        axios
          .post("/comment", {
            comment: this.form.comment,
            commentusername: this.form.commentusername,
            imageid: this.assignedid
          })
          .then(function(resp) {
            self.comments.unshift(resp.data[0]);
          });
      },
      closeemit: function() {
        this.$emit("closeimagebox");
      }
    }
  });
  ////////////////////////////////////////////////////////////////////////////
})();
