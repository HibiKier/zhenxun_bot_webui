<template>
    <div>
        <div class="circle">
            <span class="circle__btn" @click="changeSta" :class="{shadow:!btnboolean}">
                <ion-icon class="pause" :class="{'icon-visibility':!btnboolean}" name="pause"></ion-icon>
                <ion-icon class="play" :class="{'icon-visibility':!btnboolean}" name="play"></ion-icon>
            </span>
            <span class="circle__back-1" :class="{paused:!btnboolean}"></span>
            <!-- <span class="circle__back-2" :class="{paused:!btnboolean}"></span> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlayButton',
    props: {pluginSta:Boolean,tindex:Number},
    data() {
        return {
            btnboolean:this.pluginSta,
        };
    },
    watch:{
        pluginSta(newPluginSta){
            this.btnboolean = newPluginSta;
        }
    },
    mounted() {
    },

    methods: {
        changeSta(){
            this.btnboolean = !this.btnboolean;
            this.$emit('func',this.tindex,this.btnboolean);
        }
    },
};
</script>

<style scoped>
/*  PLAY BUTTON  */
.circle {
    width: 10rem;
    height: 7.3rem;
    border-radius: 1rem;
}

.circle__btn {
    position: relative;
    width: 6rem;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 3.2rem;
    color: var(--primary);
    z-index: 300;
    background: var(--greyLight-1);
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    cursor: pointer;
}

.circle__btn.shadow {
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

.circle__btn .play {
    position: absolute;
    opacity: 0;
    visibility: visible;
    transition: all 0.2s linear;
}

.circle__btn .play.icon-visibility {
    opacity: 1;
    visibility: visible;
}

.circle__btn .pause {
    position: absolute;
    transition: all 0.2s linear;
    visibility: visible;
}

.circle__btn .pause.icon-visibility {
    visibility: visible;
    opacity: 0;
}

.circle__back-1,
.circle__back-2 {
    position: absolute;
    display: block;
    top:0;
    left: 0;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    filter: blur(1px);
    z-index: 100;
}

.circle__back-1 {
    box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
    background: linear-gradient(to bottom right, var(--greyLight-2) 0%, var(--white) 100%);
    opacity: 0.5;
    transform: scale(1.4);
    /* -webkit-animation: waves 4s linear infinite;
    animation: waves 4s linear infinite; */
}

.circle__back-1.paused {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
}

.circle__back-2 {
    box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
    opacity: 0.7;
    transform: scale(1.15);
    /* -webkit-animation: waves 4s linear 2s infinite;
    animation: waves 4s linear 2s infinite; */
}

.circle__back-2.paused {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
}
@keyframes waves {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        opacity: 1;
    }

    100% {
        transform: scale(2);
        opacity: 0;
    }
}
@media screen  and (max-width:600px) {
    .circle {
        width: 6rem;
        height: 4rem;
        border-radius: 1rem;
    }
    .circle__btn{
        width: 4rem;
        height: 4rem;
        font-size: 2rem;
    }
    .circle__back-1,
    .circle__back-2 {
        width: 4rem;
        height: 4rem;
    }
}
</style>