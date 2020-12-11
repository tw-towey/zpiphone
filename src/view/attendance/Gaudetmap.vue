<template>
  <div v-if="location">
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  name: "Gaudetmap",
  components: {},
  props: ["locationObj", "latitudeObj"],
  data() {
    return {
      location: false,
      meters: "",
      flage: false
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    getMaximin(arr, maximin) {
      if (maximin == "max") {
        return Math.max.apply(Math, arr);
      } else if (maximin == "min") {
        return Math.min.apply(Math, arr);
      }
    },
    init() {
      var map = new AMap.Map("container", {
        resizeEnable: true,
        // center: this.$route.params.locationObj.latitudeAndLongitude.split(","), //地图中心点
        center: this.locationObj.split(","),
        zoom: 17, //地图显示的缩放级别
        expandZoomRange: false,
        zoomEnable: false
      });
      var content =
        '<div style="width: 1.8rem; height: 1.8rem;"><img style="width:100%; " src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" alt=""></div>';
      // 将 Icon 实例添加到 marker 上:
      var marker = new AMap.Marker({
        // position: this.$route.params.locationObj.latitudeAndLongitude.split(","),
        position: new AMap.LngLat(
          this.locationObj.split(",")[0],
          this.locationObj.split(",")[1]
        ),
        // 将 html 传给 content
        content: content,
        //  icon: '//http://192.168.8.25:666/assets/images/home/single_marker.png',
        //  icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',

        // 以 icon 的 [center bottom] 为原点

        draggable: false,
        // 设置是否可拖拽
        cursor: "move"
      });
      marker.setMap(map);
      console.log(
        "this.locationObjthis.locationObjthis.locationObj",
        this.locationObj
      );
      let arr = [];
      var maxDisntance = 99999999;
      var minName = "";
      let locat = [];
      var latitudeObj;
      var list = [];
      if (this.latitudeObj.latitude !== "") {
        this.latitudeObj.latitude.forEach(item => {
          var latitude = [item.longitude, item.latitude];
          var m1 = new AMap.LngLat(item.longitude, item.latitude);
          var m2 = new AMap.LngLat(
            this.locationObj.split(",")[0],
            this.locationObj.split(",")[1]
          );
          var dis = m1.distance(m2);
          list.push(dis);
          arr.push({
            meters: dis,
            scope: item.scope,
            latitudeObj: [item.longitude, item.latitude],
            address: item.address
          });
          if (dis < maxDisntance && dis <= item.scope) {
            maxDisntance = dis;
            this.meters = item.scope;
            minName = item.address;
            this.$emit("childByValue", item.address);
            latitudeObj = [item.longitude, item.latitude];
            this.flage = false;
          } else {
            this.flage = true;
          }
        });
        var min = this.getMaximin(list, "min");
        if (this.flage) {
          arr.forEach(item => {
            if (item.meters == min) {
              this.meters = item.scope;
              latitudeObj = item.latitudeObj;
            }
          });
        }
        var circle = new AMap.Circle({
          center: latitudeObj,
          radius: this.meters, //半径
          borderWeight: 3,
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          strokeStyle: "dashed",
          strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: "#1791fc",
          zIndex: 10
        });
        circle.setMap(map);
        // 缩放地图到合适的视野级别
        // map.setFitView([circle]);
      }
      // 设置点标记的动画效果，此处为弹跳效果
      // marker.setAnimation("AMAP_ANIMATION_BOUNCE");
    }
  },
  watch: {
    locationObj(oldvalue, newvalue) {
      if (this.locationObj != "") {
        this.location = true;
        setTimeout(() => {
          this.init();
        }, 50);
      } else {
        this.location = false;
      }
    }
  },
  created() {}
};
</script>
<style  scoped>
#container {
  width: 100%;
  height: 100vw;
}
.title {
  width: 100%;
  height: 2rem;
  line-height: 2rem;
}
.show {
  display: block;
}
.hide {
  display: none;
}
</style>