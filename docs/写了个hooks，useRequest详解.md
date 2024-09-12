# 谈一谈项目中hooks的用法，useRequest使用案例

## 前言
大三暑假阶段本人在上一家实习公司离开了，尽管在部门领导的邀约下还是选择离开（这里就不过多说明了），所以这段时间一直在熟悉新公司的业务和自己的琐事。很长时间没有更新自己在前端的点点滴滴了但这不代表我没有学习哦，由于之前实习公司接触`vue2`比较多，刚上手`vue3`的时候大家肯定被`hooks`搞懵逼了，其实这就是`vue3`中`composition-api`的实现，是一系列逻辑的集合，使我们使用函数而不是声明式的方法写`Vue`组件


## 介绍

- 组合式 API 最基本的优势是它使我们能够通过组合函数来实现更加简洁高效的逻辑复用。在选项式 API 中我们主要的逻辑复用机制是 `mixins`，而组合式 API 解决了 `mixins` 的所有缺陷

- 组合式 API 的另一个优势是它允许我们使用 `ref` 和 `reactive` 来创建响应式数据，而选项式 API 只能通过 `data` 选项来创建响应式数据，这限制了组合式 API 的灵活，而组合式 API 则提供了更好的数据共享能力

## 使用场景

平时我们 写自定义hooks俩种场景

- 一种是 基于业务的 自定义hooks 只是为了单纯提取 可复用的逻辑 ，缺点是只能用在自己项目中
- 一种是 可复用行强的 可在全局使用的 比如对于弹框、表格、表单、请求等等的自定义hooks

## 我的（useRequest）封装背景

我们有很多需要通过异步请求获取数据的场景，在此过程中会可能存在有很多的处理，如 loading、错误捕获、数据处理、请求前校验等。常见的请求处理逻辑一般有些重复，比如每次请求都需做 loading、错误捕获、数据处理、请求前校验等，我们可以封装一个 useRequest 来解决这个问题。这里有个mini case 复现一下给大家
```js
<script>
const list1 = ref ([]);
const list2 = ref  ([]);
const userInfo = ref ({});

async function getList1() {
  try {
    const result1 = await getList1Api();
    list1.value = result1;
  } catch (err) {
    // ... 错误处理
  }
}

async function getList2() {
  try {
    const result2 = await getList2Api();
    list2.value = result2;
  } catch (err) {
    // ... 错误处理
  }
}

async function getUserInfo() {
  try {
    const result3 = await getUserInfoApi({ id: 3 });
    userInfo.value = result3;
  } catch (err) {
    // ... 错误处理
  }
}

getList1();
getList2();
getUserInfo();
</script>
```
大家平时接触这样的代码相信也比较多看着也没有问题。但其实大家认真分析这样的代码无非是在做重复的事情 我们来复现一下过程

1. 声明初始化数据
2. 发起getList1请求请求函数
3. 调用这个函数，驱动数据更新

## useRequest 使用
对于上述代码大家肯定非常熟悉以及感到亲切，作为一个合格的爱码仕人，这些代码都是重复的，我们肯定希望减少编写重复代码的目的，强迫症促使我必须封装一个轮子一个`hook`进行使用，在这里我们直接带大家使用，后面我被将源码放在这篇文档，现在带大家看看怎么在`.vue`文件中使用的
```vue
<script setup>
import { useRequest } from './hooks/useRequest';


const { data, run, loading, error } = useRequest(api);


</script>

<template>
  <span v-if="loading">loading~~~</span>
  <template v-else>
    <span v-if="error">{{ error }}</span>
    <span v-else>{{ data }}</span>
  </template>
</template>

<style scoped></style>
```
现在代码是不是看起来简单多了，而且每个数据的定义也省去了这是因为我们在`hook`做了响应式数据的定义和处理。这里的传参类型大家现在看出出来没关系我在`useRequest`源码中详细写了`params`类型

### 初始值定义
某些业务场景可以是点击触发才获取数据 调用api 故需要给数组初始值所以我们肯定也需要这个功能
```js
const { data }=useRequest(api,config:{ initData:[] })
```

### 初始参数定义
```js
const { data }=useRequest(api,
  { 
    initData:{
        data:[],
        pageNum:1,
        pageSize:10,
        total:0 
        },
    initParams:[
        keywords:'',
        {page:1,size:10}
        ]
  }
)
```

### 是否立即调用
看了上述使用大家应该知道大概如何使用了，就是三个数据的暴露，还有就是`run`方法执行这个api请求以及参数是如何传递的，有些情况需要组件实例创建完后立即调用所以需要`immediate`参数，默认为fale，可以设置为true，此时组件实例创建完后会立即调用，不需要手动调用`run`方法。

```js
const { data }=useRequest(api,
  { 
    initData:{
        data:[],
        pageNum:1,
        pageSize:10,
        total:0 
        },
    immediate:true,
    initParams:[
        keywords:'',
        {page:1,size:10}
        ]
  }
)
```
### 加入数据处理逻辑
有些场景你需要对后端传进来的数据进行更改做一个截取的操作你可以传进去一个处理函数`processResDate`
```js
const { data }=useRequest(api,
  processResData(res) {
    if ( res.code === 200) {
        return res.data[0] // 返回需要的数据
    }
    return Promise.reject(res.msg)
  }
)

```

## 源码地址链接
https://github.com/xiupuxie/vue-hook-useRequest

## useRequest源码
```js

import { ref } from 'vue'

function apiWithErrorWrapper(api) {
  return function apiWithError(...args) {
    return api(...args).then(res => {
      if (typeof res === 'object' && res !== null) {
        if (Object.hasOwn(res, 'error')) {
          return Promise.reject(new Error(res.error))
        }
        if (res.isError) {
          return Promise.reject(new Error(500))
        }
      }
      return res
    })
  }
}

/**
 * @param {(...args:Array<any>) => Promise} api
 * @param {{ retryCount?:number, initData?:any, immediate?:boolean, initParams?:Array<any>}} config
 */
export function useRequest(api, config) {
  const {
    retryCount = 0,
    initData = undefined,
    immediate = false,
    initParams = [],
    processResErr = true,
    processResData = res => Promise.resolve(res)
  } = {
    ...config
  }

  const loading = ref(false)
  const data = ref(initData)
  const error = ref()
  let resolve, reject
  let count = ref(0)
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  let ps = Promise.resolve()

  const apiFunc = processResErr ? apiWithErrorWrapper(api) : api

  function run(...args) {
    if (count.value > retryCount) {
      loading.value = false
      count.value = 0
      reject(error.value)
      return ps
    }
    loading.value = true
    error.value = undefined
    count.value++
    ps = apiFunc(...args)
      .then(processResData)
      .then(res => {
        data.value = res
        count.value = 0
        loading.value = false
        resolve(res)
        return data.value
      })
      .catch(err => {
        if (err instanceof Error) {
          error.value = err
        } else if (`${err}` == err) {
          error.value = new Error(err)
        } else {
          error.value = new Error('Unknown error')
        }
        ps = run(...args)
        return ps
      })

    return ps
  }

  if (immediate) {
    run(...initParams)
  }

  return { loading, data, error, run, promise }
}
```




## 总结
因为这个是我根据日常开发封装的`hook`，所以在功能方面还有不足，但已经能满足开发中的大部分场景，如果后续遇到相应的场景进行扩展，目前已经在项目中使用，并没有什么问题。这里还有个代码捕获错误重试的功能感兴趣也可以去看一看，目前功能只有这些后续的话根据业务也可进行补充。
目前还没有毕业，接触的业务代码不多应该也就只能想到这些场景希望自己变强 加油！

