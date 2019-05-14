<template>
  <div>
    <div class="button">
      <p class="pass" @click="pass()">审核通过</p>
      <p class="Nopass" @click="Nopass()">审核不通过</p>
    </div>
    <van-dialog v-model="dialogshow" show-cancel-button :before-close="beforeClose">
      <p class="cause">不通过原因</p>
      <van-field
        v-model="reason"
        type="textarea"
        placeholder="请输入文字"
        class="textarea"
        rows="1"
        autosize
      />
    </van-dialog>
  </div>
</template>

<script>
  export default {
    name: "PassAndNoPass",
    components: {},
    props: ["list", "error"],
    data() {
      return {
        dialogshow: false,
        type: "",
        reason: ""
      };
    },
    methods: {
      pass() {
        // 通过
        this.type = 'pass';
        const checkedList = this.list.length && this.list.filter((ele)=> {
            return ele.selected == true;
          }) || [];

        if (checkedList.length == 0) {
          this.Toast(this.error);
          return;
        }

        this.$emit('auditHandle', {type: this.type});
      },
      Nopass() {
        // 不通过

        this.type = 'unPass';

        const checkedList = this.list.filter((ele)=> {
            return ele.selected == true;
          }) || [];

        if (checkedList.length == 0) {
          this.Toast(this.error);
        } else {
          this.reason = "";
          this.dialogshow = true;
        }

      },
      beforeClose(action, done) {
        if (action === "confirm") {
          // 确定
          if (!this.reason) {
            this.Toast({duration: 500, message: "请填写审核意见"});
            done(false);
            return;
          }

          if (this.reason.length > 100) {
            this.Toast({duration: 500, message: "审核意见字数不能大于100"});
            done(false);
            return;
          }

          this.$emit("auditHandle", {type: "unPass", data: this.reason});
        }
        done();
      }
    },
    created() {

    }
  };
</script>
<style scoped>
  .button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    color: white;
    font-size: 0.875rem;
  }

  .button p {
    width: 50%;
    text-align: center;
    padding: 0.5rem 0;
    margin: 0;
  }

  .button .pass {
    background: #007acc;
  }

  .button .Nopass {
    background: #cd3333;
  }

  .cause {
    text-align: center;
    padding: 0.2rem;
    border-bottom: 1px solid #f8f8f8;
  }

  .textarea {
    margin-left: 0.3rem !important;
  }
</style>
