<template>
  <div>
    <van-cell title="患者信息" size="large"/>
    <van-field
      v-model="system.name"
      required
      clearable
      label="患者姓名"
      placeholder="请输入患者姓名"
      input-align="right"
    />
   
    <div class="radioAdd">
       <van-cell title="就诊签到" required/>
      <van-radio-group v-model="system.isExtramural" class="radioname">
        <div v-for="item in extramural">
          <van-radio :name="item.key">
            <img
              slot="icon"
              slot-scope="props"
              :src="props.checked ? icon.active : icon.normal"
              class="dadioimg"
            >
            <span>{{item.value}}</span>
          </van-radio>
        </div>
      </van-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "Consilia",
  props: ["ConsiliaData"],
  data() {
    return {
      system: {
        name: "", // 患者姓名
        isExtramural: ""
      },
      icon: {
        normal: require("../assets/images/home/pic_ses-01.svg"),
        active: require("../assets/images/home/pic_ses-02.svg")
      },
      extramural: [
        //主讲人类型
        { key: 0, value: "初诊" },
        { key: 1, value: "复诊" }
      ]
    };
  },
  //方法集合
  methods: {
    addData() {
      if (this.ConsiliaData == "add") {
      }
    }
  },
  created() {
    this.addData();
  }
};
</script>
<style  scoped>
.radioAdd {
  background: white;
  padding: 0.5rem 0;
  border: 1px solid #fafafa;
  display: flex;
}
.radioname {
  width: 50%;
  display: flex;
  justify-content: space-between;
  margin-top:0.8rem; 
}
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
</style>