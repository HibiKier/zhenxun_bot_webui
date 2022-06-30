<template>
    <div class="segmented-control" @change="changeValue">

        <input type="radio" name="segmented-control" :id="'segmented-control-'+tindex+'-1'" value="全部" class="tab-1" v-model='checkValue' />
        <label :for="'segmented-control-'+tindex+'-1'" class="segmented-control__1">
          <p>全部</p>
        </label>

        <input type="radio" name="segmented-control" :id="'segmented-control-'+tindex+'-2'" value="群组" class="tab-2" v-model='checkValue'/>
        <label :for="'segmented-control-'+tindex+'-2'" class="segmented-control__2">
          <p>群组</p>
        </label>

        <input type="radio" name="segmented-control" :id="'segmented-control-'+tindex+'-3'" value="私聊" class="tab-3" v-model='checkValue'/>
        <label :for="'segmented-control-'+tindex+'-3'" class="segmented-control__3">
          <p>私聊</p>
        </label>

        <div class="segmented-control__color"></div>
      </div>
</template>

<script>
export default {
    name: 'SegmentedControl',
    props:['block_type','tindex'],
    data() {
        return {
            checkValue:this.block_type,
        };
    },
    watch:{
        block_type(newval){
            this.checkValue = newval;
        }
    },
    mounted() {
    },

    methods: {
        changeValue(){
            this.$emit('func',this.tindex,this.checkValue);
        }
    },
};
</script>

<style scoped>
    /*  SEGMENTED-CONTROL */
  .segmented-control {
    width: 10rem;
    height: 2rem;
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    position: relative;
  }

  .segmented-control input {
    display: none;
  }

  .segmented-control>input:checked+label {
    transition: all 0.5s ease;
    color: var(--primary);
  }

.segmented-control__1{
    margin-left: 0.25rem;
}
  .segmented-control__1,
  .segmented-control__2,
  .segmented-control__3 {
    width: 3rem;
    height: 1.5rem;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--greyDark);
    transition: all 0.5s ease;
  }

  .segmented-control__1:hover,
  .segmented-control__2:hover,
  .segmented-control__3:hover {
    color: var(--primary);
  }

  .segmented-control__color {
    position: absolute;
    height: 1.5rem;
    width: 3rem;
    margin-left: 0.3rem;
    border-radius: 0.8rem;
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
    pointer-events: none;
  }

  .tab-1:checked~.segmented-control__color {
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .tab-2:checked~.segmented-control__color {
    transform: translateX(3rem);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .tab-3:checked~.segmented-control__color {
    transform: translateX(6rem);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  @media screen  and (max-width:600px) {
      
    .segmented-control {
      width: 7rem;
      height: 1.5rem;
    }
    .segmented-control__1,
    .segmented-control__2,
    .segmented-control__3 {
      width: 2rem;
      height: 1rem;
      font-size: 0.5rem;
    }
    .segmented-control__color {
      height: 1rem;
      width: 2rem;
    }
    .tab-1:checked~.segmented-control__color {
      transform: translateX(0);
    }

    .tab-2:checked~.segmented-control__color {
      transform: translateX(2rem);
    }

    .tab-3:checked~.segmented-control__color {
      transform: translateX(4rem);
    }
  }
</style>