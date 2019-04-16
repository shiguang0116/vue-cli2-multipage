# vue-cli2-multipage

> 一个基于vue-cli2构建的多页面项目

## 构建步骤

	``` bash

	# 安装依赖
	npm install
	# 本地测试
	npm run dev
	# 打包
	npm run build
	
	```

## 附：如何改造vue-cli

1. 创建项目
	
	```bash
	vue init webpack vue-multi-page
	```
2. 开始改造

	+ 首先，我们对 utils.js进行改造
		添加一个方法：getEntries，方法中需要使用到node的globa模块，所以需要引入 
		
		```
  		// glob模块，用于读取webpack入口目录文件
      // 看到issue中有人问glob模块，这个是需要npm安装的，[https://github.com/isaacs/node-glob](https://github.com/isaacs/node-glob)
      var glob = require('glob');
    ```
		
		```javascript
		exports.getEntries = function (globPath) {
      var entries = {}
      /**
       * 读取src目录,并进行路径裁剪
       */
      glob.sync(globPath).forEach(function (entry) {
        /**
         * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
         * path.extname 获取文件后缀
         */
        var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
        // ***************begin***************
        // 当然， 你也可以加上模块名称, 即输出如下： { module/main: './src/module/index/main.js', module/test: './src/module/test/test.js' }
        // 最终编译输出的文件也在module目录下， 访问路径需要时 localhost:8080/module/index.html
        // slice 从已有的数组中返回选定的元素, -3 倒序选择，即选择最后三个
        // var tmp = entry.split('/').splice(-3)
        // var pathname = tmp.splice(0, 1) + '/' + basename; // splice(0, 1)取tmp数组中第一个元素
        // console.log(pathname)
        // entries[pathname] = entry
        // ***************end***************
        entries[basename] = entry
      });
      // console.log(entries);
      // 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/test.js' }
      return entries;
    }
		```
	+ 其次，对webpack.base.conf.js进行改造
		
		删除 ~~entry: {app: './src/main.js'},~~，取而代之如下：

		```javascript
  		module.exports = {
  			···
  			entry: utils.getEntries('./src/module/**/*.js'),
  		  ···
  		}
		```
	+ 然后改造webpack.dev.conf.js和webpack.prod.conf.js
		
		移除原来的HtmlWebpackPlugin
		
		```javascript
		  var pages = utils.getEntries('./src/module/**/*.html')
      for(var page in pages) {
        // 配置生成的html文件，定义路径等
        var conf = {
          filename: page + '.html',
          template: pages[page], //模板路径
          inject: true,
          // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
          // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
          // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
          // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
          excludeChunks: Object.keys(pages).filter(item => {
            return (item != page)
          })
        }
        // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
        module.exports.plugins.push(new HtmlWebpackPlugin(conf))
      }
		```

	+ 最后改造config/index.js


