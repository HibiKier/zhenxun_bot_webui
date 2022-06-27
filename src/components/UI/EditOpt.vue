<template>
    <div>
        <div class="optbox">
            <div class="title"> 
                <span class="tspan">编辑配置项</span>
            </div>

            <div class="flex-box opt-title">
                <div>键</div>
                <div>值</div>
                <div>说明</div>
                <div>默认值</div>
            </div>
            <div class="opt-item">

            </div>
        </div>
        <div class="cover" @click.stop="closeEditOpt"></div>
    </div>
    
</template>

<script>
export default {
    name: 'EditOpt',

    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        closeEditOpt(){
            console.log(1);
            this.$emit('close');
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
    height: 40vh;
    width: 50vw;
    padding: 2rem;
    z-index: 10000;
    background: var(--greyLight-1);
    border-radius: 3rem;
    transform: translate(50%, -50%);
    box-shadow: 0.1rem 0.1rem 0.4rem var(--greyLight-2), -0.1rem -0.1rem 0.4rem var(--white);
}
.title{
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
.flex-box{
    box-sizing: border-box;
    display: flex;
    width:100%;
    font-size: 1.1rem;
    color: var(--greyDark);
}
.flex-box > div{
    flex:1;
    text-align: center;
    margin-right: 0.3rem;
    border-radius: 0.8rem;
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
    pointer-events: none;
}
</style>