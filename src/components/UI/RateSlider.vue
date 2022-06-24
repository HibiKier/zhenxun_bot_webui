<template>
    <div class="slider">
        <div class="slider__box" ref="slider__box">
            <span class="slider__btn" ref="slider__btn"></span>
            <span class="slider__color" ref="slider__color"></span>
            <span class="slider__tooltip" ref="slider__tooltip">{{alevel}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RateSlider',
    props: {level:Number,tindex:Number},
    data() {
        return {
            alevel:this.level,
            container:null,
            btn:null,
            color:null,
            tooltip:null,
            onMouseMove:null,
            onMouseUp:null
        };
    },
    watch: {
      level(newLevel) {
        this.alevel = newLevel;
        this.btnInit(this.container, this.btn, this.alevel+1);
      },
    },
    mounted() {
        this.container = this.$refs.slider__box;
        this.btn =  this.$refs.slider__btn;
        this.color = this.$refs.slider__color;
        this.tooltip = this.$refs.slider__tooltip;
        this.btnInit(this.container, this.btn, this.alevel);
        this.dragElement(this.container, this.btn);
    },

    methods: {
        btnInit(target, btn, alevel){
            let targetRect = target.getBoundingClientRect();
            let percentPosition = alevel * targetRect.width / 10;
            this.color.style.width = percentPosition + "px";
            btn.style.left = percentPosition-12 + "px";
        },
        dragElement(target, btn){
            this.onMouseMove = (e) => {
                let targetRect = target.getBoundingClientRect();
                let x = e.pageX - targetRect.left + 10;
                if (x > targetRect.width) { x = targetRect.width }
                if (x < 0) { x = 0 }
                btn.x = x - 10;
                btn.style.left = btn.x + 'px';
            
                // get the position of the button inside the container (%)
                let percentPosition = (btn.x + 15) / targetRect.width * 10;
            
                // color width = position of button (%)
                // this.color.style.width = (Math.round(percentPosition)*100/10) + "%";
                this.color.style.width = x + "px";
                // move the tooltip when button moves, and show the tooltip
                // this.tooltip.style.left = btn.x - 5 + 'px';
                this.tooltip.style.opacity = 1;
            
                // show the percentage in the tooltip
                this.alevel = Math.round(percentPosition)-1;
            };
  
            this.onMouseUp = () => {
                window.removeEventListener('mousemove', this.onMouseMove);
                this.$emit('func',this.tindex,this.alevel);
                // this.tooltip.style.left = "90%";
            
                // btn.addEventListener('mouseover', ()=>{
                //     this.tooltip.style.opacity = 1;
                // });
            
                // btn.addEventListener('mouseout', ()=>{
                //     this.tooltip.style.opacity = 0;
                // });
            };
            let myOnMouseMove = this.onMouseMove;
            let myOnMouseUp = this.onMouseUp;
            target.addEventListener('mousedown', (e) => {
                myOnMouseMove(e);
                window.addEventListener('mousemove', myOnMouseMove,{passive:false});
                window.addEventListener('mouseup', myOnMouseUp,{passive:false});
            });
        }
    },
};
</script>

<style scoped>
/*  RANGE-SLIDER  */
.slider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20rem;
}

.slider__box {
  margin-left: 1rem;
  width: 77%;
  height: 1rem;
  cursor: pointer;
  box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
  border-radius: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider__btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--white);
  position: absolute;
  box-shadow: 0px 0.1rem 0.3rem 0px var(--greyLight-3);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider__btn:hover~.slider__tooltip {
  opacity: 1;
}

.slider__btn::after {
  content: "";
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

.slider__color {
  height: 100%;
  width: 50%;
  position: absolute;
  left: 0;
  z-index: 100;
  border-radius: inherit;
  background: var(--primary);
  background: linear-gradient(-1deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
}

.slider__tooltip {
  position: absolute;
  left:94%;
  margin-left: 2rem;
  height: 2.5rem;
  width: 3rem;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: var(--primary);
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  opacity: 1;
  z-index: 100;
  transition: opacity 0.3s ease;
}
</style>