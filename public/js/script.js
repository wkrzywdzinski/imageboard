(function() {
  /////////////////////////////showimage///////////////
  Vue.component("showimage", {
    template: "#my-template",
    props: ["assignedid", "prev", "next"],
    // prop takes property of parent
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
        // console.log("watcher watches", this.assignedid);
        axios.get("/get-picture/" + this.assignedid).then(function(resp) {
          self.url = resp.data[0].url;
          self.username = resp.data[0].username;
          self.description = resp.data[0].description;
          self.title = resp.data[0].title;
          self.comments = resp.data;
        });
      },
      prev: function() {
        var self = this;
      },
      next: function() {
        var self = this;
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
        // console.log(self);
      });
    },
    methods: {
      showprev: function() {
        this.$emit("prev");
      },
      shownext: function() {
        this.$emit("next");
      },
      uploadcomment: function(e) {
        var self = this;
        e.preventDefault();
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
  new Vue({
    el: "#main",
    data: {
      header: "imageboard",
      images: [],
      imageid: location.hash.slice(1) || 0,
      lastid: null,
      firstid: null,
      moreimages: true,
      next: true,
      prev: true,
      form: {
        title: "",
        description: "",
        username: "",
        file: null
      }
    },
    mounted: function() {
      var self = this;
      window.addEventListener("hashchange", function() {
        // console.log("location hash", location.hash.slice(1));
        self.imageid = location.hash.slice(1);
      });
      axios.get("/get-info").then(function(resp) {
        let getrespfromserver = resp.data;
        self.images = getrespfromserver;
        self.lastid = self.images[self.images.length - 1].id;
        self.firstid = self.images[0].id;
      });
    },
    methods: {
      checkid: function() {
        this.imageid = event.currentTarget.id;
      },
      closecomponent: function() {
        this.imageid = null;
      },
      nextcall: function() {
        var self = this;
        if (this.imageid >= 2) {
          let minusid = this.imageid - 1;
          self.prev = true;
          self.imageid = minusid;
        } else {
          self.next = false;
        }
      },
      prevcall: function() {
        var self = this;
        if (this.imageid < this.firstid) {
          let plusid = Number(this.imageid) + 1;
          self.next = true;
          self.imageid = plusid;
        } else {
          self.prev = false;
        }
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
          let postrespfromserver = resp.data[0];
          self.images.unshift(postrespfromserver);
        });
      },
      getmoreimages: function() {
        var self = this;
        self.lastid = self.images[self.images.length - 1].id;
        if (self.lastid == 1) {
          this.moreimages = false;
        }
        axios.get("getmoreimages/" + self.lastid).then(function(resp) {
          self.images.push.apply(self.images, resp.data);
        });
      }
    }
  });
})();
