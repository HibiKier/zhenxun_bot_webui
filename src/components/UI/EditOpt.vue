<template>
    <div>
        <div class="optbox">
            <div class="title"> 
                <span class="tspan">编辑配置项</span>
            </div>
            <div class="flex-box opt-item opt-title">
                <div><span>键</span></div>
                <div><span>值</span></div>
                <div><span>说明</span></div>
                <div><span>默认值</span></div>
            </div>
            <div class="scroll-box">
                <div class="flex-box opt-item" v-for="(optdata) in editOptDataScoped" :key="optdata.id">
                    <div><span>{{optdata.key}}</span></div>
                    <div><input type="text" v-model="optdata.value" class="form__input" placeholder="无"></div>
                    <div><span>{{optdata.help_}}</span></div>
                    <div><span>{{optdata.default_value}}</span></div>
                </div>
            </div>
        
            <div class="edit-btn">
                <div class="btn btn__primary" @click.stop="changeOpt">
                    <p>保存</p>
                </div>
                <div class="btn btn__secondary" @click.stop="closeEditOpt">
                    <p>取消</p>
                </div>
            </div>
        </div>
        <div class="cover" @click.stop="closeEditOpt"></div>
    </div>
    
</template>

<script>
export default {
    name: 'EditOpt',
    props:["editOptData"],
    data() {
        return {
            editOptDataScoped: this.editOptData.data,
        };
    },

    mounted() {

    },

    methods: {
        closeEditOpt(){
            this.$emit('close');
        },
        changeOpt(){
            this.editOptDataScoped.forEach(element => {
                if(typeof element.value == "string"){
                    element.value = element.value.replace('，', ',');//逗号转换
                }
            });
            this.$emit('changeOpt',this.editOptDataScoped,this.editOptData.index);
        }
    },
};
</script>

<style scoped>
.cover{
    position:fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: #18171738;
    z-index: 9999;
}
.optbox{
    position:fixed;
    top:50%;
    right: 50%;
    max-height: 53vh;
    width: 50vw;
    padding: 1rem;
    z-index: 10000;
    background: var(--greyLight-1);
    border-radius: 3rem;
    transform: translate(50%, -50%);
    box-shadow: 0.1rem 0.1rem 0.4rem var(--greyLight-2), -0.1rem -0.1rem 0.4rem var(--white);
}
.title{
    user-select: none;
    padding: 0px 0px 2rem 0px;
}
.tspan , .flex-box{
    border-radius: 1rem;
    font-size: 1.2rem;
    padding:0 1.8rem;
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    background: none;
    font-family: inherit;
    font-size: 1.3rem;
}
.scroll-box{
    position:relative;
    max-height: 30vh;
    scrollbar-width: none; 
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.5rem 1rem 0.6rem 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.4rem;
}
.scroll-box::-webkit-scrollbar { 
    display: none;
}
.flex-box{
    box-sizing: border-box;
    display: flex;
    color: var(--greyDark);
}
.flex-box > div{
    flex:1;
    word-break: break-word;
}
.flex-box > div >span{
    padding:0 .7rem;
}
.opt-title{
    box-sizing: border-box;
    margin: 0 1rem !important;
    height: 2.2rem;
    user-select: none;
}
.opt-title > div{
    margin: 0.2rem 0 !important;
    margin-right: 0.3rem !important;
    border-radius: 0.8rem;
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
    pointer-events: none;
}
.opt-item{
    margin-bottom: 1rem;
    font-size: 0.9rem;
}
.opt-item > div{
    display: flex;
    align-items: center;
    text-align: left;
    padding: 0.9rem 0rem;
}
.opt-item > div:nth-child(2){
    margin-right: 0.3rem;
}
.opt-item > div:nth-child(3){
    line-height: 1.5rem;
}
.form__input {
  width: 100%;
  height: 2rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.2rem;
  padding:0 1.4rem;
  outline: none;
  box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
  background: none;
  font-family: inherit;
  color: var(--greyDark);
}
.edit-btn{
    display: flex;
    width: 100%;
    justify-content: space-around;
}

 /*  BUTTONS  */
.btn {
    width: 10rem;
    height: 3rem;
    border-radius: 1rem;
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: 0.3s ease;
}

.btn__primary {
    background: var(--primary);
    box-shadow: inset 0.2rem 0.2rem 1rem var(--primary-light), inset -0.2rem -0.2rem 1rem var(--primary-dark), 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    color: var(--greyLight-1);
}

.btn__primary:hover {
    color: var(--white);
}

.btn__primary:active {
    box-shadow: inset 0.2rem 0.2rem 1rem var(--primary-dark), inset -0.2rem -0.2rem 1rem var(--primary-light);
}

.btn__secondary {
    color: var(--greyDark);
}

.btn__secondary:hover {
    color: var(--primary);
}

.btn__secondary:active {
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

.btn p {
    font-size: 1.3rem;
}
</style>