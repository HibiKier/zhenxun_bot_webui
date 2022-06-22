<template>
    <div class="slider">
        <div class="slider__box" ref="slider__box">
            <span class="slider__btn" ref="slider__btn"></span>
            <span class="slider__color" ref="slider__color"></span>
            <span class="slider__tooltip" ref="slider__tooltip">50%</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RateSlider',

    data() {
        return {
            container:null,
            btn:null,
            color:null,
            tooltip:null,
            onMouseMove:null,
            onMouseUp:null
        };
    },

    mounted() {
        // this.container = document.querySelector('.slider__box');
        // this.btn = document.querySelector('.slider__btn');
        // this.color = document.querySelector('.slider__color');
        // this.tooltip = document.querySelector('.slider__tooltip');
        this.container = this.$refs.slider__box;
        this.btn =  this.$refs.slider__btn;
        this.color = this.$refs.slider__color;
        this.tooltip = this.$refs.slider__tooltip;
        this.dragElement(this.container, this.btn);
    },

    methods: {
        dragElement(target, btn){
            this.onMouseMove = (e) => {
                let targetRect = target.getBoundingClientRect();
                let x = e.pageX - targetRect.left + 10;
                if (x > targetRect.width) { x = targetRect.width }
                if (x < 0) { x = 0 }
                btn.x = x - 10;
                btn.style.left = btn.x + 'px';
            
                // get the position of the button inside the container (%)
                let percentPosition = (btn.x + 10) / targetRect.width * 100;
            
                // color width = position of button (%)
                this.color.style.width = percentPosition + "%";
            
                // move the tooltip when button moves, and show the tooltip
                this.tooltip.style.left = btn.x - 5 + 'px';
                this.tooltip.style.opacity = 1;
            
                // show the percentage in the tooltip
                this.tooltip.textContent = Math.round(percentPosition) + '%';
            };
  
            this.onMouseUp = () => {
                window.removeEventListener('mousemove', this.onMouseMove);
                this.tooltip.style.opacity = 0;
            
                btn.addEventListener('mouseover', ()=>{
                    this.tooltip.style.opacity = 1;
                });
            
                btn.addEventListener('mouseout', ()=>{
                    this.tooltip.style.opacity = 0;
                });
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
  width: 50%;
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
  left:4rem;
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
  opacity: 0;
  z-index: 100;
  background-color: white;
  transition: opacity 0.3s ease;
}
</style>