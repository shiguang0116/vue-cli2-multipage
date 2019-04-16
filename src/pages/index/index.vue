<template>
<<<<<<< HEAD
    <div>
        <h1>首页</h1>
        <a href="shop.html">jump to shop.html</a>

        <div>
            <img alt="Vue logo" src="@/assets/logo.png">
            <HelloWorld msg="HelloWorld组件"/>
        </div>
    </div>
</template>

<script>
    import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: "index",
        components: {
            HelloWorld
        }
    }
</script>

<style scoped>

</style>
=======
	<div>
		<img src="../../images/logo.png" height="200" width="200" alt="">
		<h1>This is index.vue</h1>
		<a href="/about.html">jump to about</a>
		<!-- layout -->
		<div class="row row-middle row-around">
			<p class="h" style="background-color: red">111</p>
			<p style="background-color: purple">222</p>
			<p style="background-color: pink">333</p>
		</div>

        <tab>
			<tab-item selected @on-item-click="onItemClick">已发货</tab-item>
			<tab-item @on-item-click="onItemClick">未发货</tab-item>
			<tab-item @on-item-click="onItemClick">全部订单</tab-item>
	    </tab>
		
		<group label-width="5.5em" label-margin-right="2em" label-align="">
			<x-input title="姓名" v-model="name"></x-input>
	    	<datetime title="生日" v-model="value" :end-date="endDate" @on-change="change"></datetime>
			<x-address title="地址选择" v-model="addressValue" raw-value :list="addressData"></x-address>
        </group>
	</div>
</template>

<script>
import { Tab, TabItem, Group, XInput, Datetime, XAddress, ChinaAddressData } from 'vux'

export default {
	components: {
		Tab, TabItem, Group, XInput, Datetime, XAddress, ChinaAddressData
	},
	data(){
		return {
			name: '',
			value: '2018-03-22',
			endDate: '2018-04-23',
			addressData: ChinaAddressData,
        	addressValue: ['广东省', '深圳市', '南山区'],
			change(value){
				console.log(value)
			},
			onItemClick(value){
				console.log(value)
			},
		}
	}
}
</script>

<style lang="less" scoped>
	
</style>

>>>>>>> vue-cli多页面改造完成
