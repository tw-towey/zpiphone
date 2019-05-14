<template>
  <div class>
    <div v-show="htmlshow">
      <van-field
        v-model="textareaa.activity"
        type="textarea"
        :placeholder="textareaa.placeholder"
        v-if="inpshow"
      />
      <p v-html="textareaa.activity" @click="textaClick()" v-if="!inpshow"></p>
    </div>
    <van-field
      v-model="textareaa.activity"
      type="textarea"
      :placeholder="textareaa.placeholder"
      v-show="textshow"
    />
    <van-dialog v-model="show" title="标题" show-cancel-button @confirm="confirm">
      <p>请通过电脑端编辑内容，如果直接编辑将丢弃文本格式。是否继续？</p>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "InputField",
  props: ["textareaa"],
  data() {
    return {
      textt: "",
      textshow: false,
      htmlshow: true,
      show: false,
      aaaa: "",
      inpshow: false
    };
  },
  methods: {
    textaClick() {
      this.show = true;
    },
    confirm() {
      this.textshow = true;
      this.htmlshow = false;
      this.textareaa.activity = this.textareaa.activity.replace(/<[^>]+>/g, "");
    }
  },
  mounted() {
    this.textareaa.activity = this.textareaa.activity.replace(/<[^>]+>/g, "");
  },

  created() {
    if (this.$store.state.seeAdd === "look") {
      if (!this.textareaa.activity) {
        this.textareaa.placeholder = "";
        this.inpshow = false;
      } else {
        this.inpshow = true;
      }
      setTimeout(() => {
        this.textareaa.activity = this.textareaa.activity.replace(
          /<[^>]+>/g,
          ""
        );
      }, 300);
    }
    if (this.$store.state.inputtext == "添加") {
      this.textshow = true;
      this.htmlshow = false;
    } else {
    }
  }
};
</script>
<style scoped>
p {
  padding: 0.5rem 0.5rem 0.5rem 0.9rem;
  margin: 0;
}
</style>