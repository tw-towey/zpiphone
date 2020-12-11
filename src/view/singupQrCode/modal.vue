<template>
  <div>
    <van-dialog
        v-model="showQrCode.show"
        title="活动评价提示"
        :show-confirm-button="false"
        >
            <div class="msg">{{showQrCode.msg || this.msg}}</div>
            <div class="box">
                <van-button type="info" @click="goNext()">前往评价</van-button>
                <van-button type="info" v-if="!showQrCode.data.isMustEvaluate" @click="nextSay()">下次再说</van-button>
            </div>
    </van-dialog>
  </div>
</template>

<script>

export default {
    props: ['showQrCode'],
    name: "Modal",
    data() {
        return {
            showCancel: true,
            msg:""
        };
    },
    methods: {
        goNext() {
            this.$router.push({name: 'subAnswer', params: {
                id: this.$store.state.activitiesDetailsObj.id,
                evaluateId: this.$store.state.activitiesDetailsObj.evaluateId,
                callback: this.showQrCode.callback
            }})
        },
        nextSay() {
            if(this.showQrCode.type == 1){
              this.$parent.saveQrSignInOrSignOut(this.$parent.paramsDate);
            }
            if(this.showQrCode.type == 2){
               this.$emit('signinKQ', this.showQrCode.paramsDate);
            }
            this.showQrCode.show = false;
        }

    },
    created() {
    },
    mounted(){
        this.msg = '此活动要求必须进行活动评价，否则将无法进行签退打卡';
    }
};
</script>
<style  scoped>
    .box {
        display: flex;
        justify-content: space-around;
        margin-bottom: 1rem;
    }
    .msg {
        height: 3rem;
        font-size: .8rem;
        padding: 1rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 1rem;
    }
    .box >>> .van-button {
        height: 2rem;
        line-height: 2rem;

    }

</style>