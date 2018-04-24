<template>
	<div>
		<v-header></v-header>
		<v-page></v-page>
		<v-footer></v-footer>
	</div>
</template>

<script>
import vHeader from 'common/header'
import vFooter from 'common/footer'
import vPage from 'pages/index/index'

export default {
	components: {
		vHeader,
		vFooter,
		vPage
	},
	data(){
		return {

		}
	}
}
</script>

<style scoped>

</style>

