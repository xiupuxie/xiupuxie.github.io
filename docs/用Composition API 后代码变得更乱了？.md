# 用了组合式（Composition API） 后代码变得更乱了？应该怎么办？

## 背景
组合式 `(Composition) API` 的一大特点是“非常灵活”，但也因为非常灵活，每个开发都有自己的想法。加上项目的持续迭代导致我们的代码变得愈发混乱，最终到达无法维护的地步。我在我司工作的时候就有这个感受，甚至有的人写的都不是很好去理解，所以我打算从入行开始就强烈要求自己要写更可读的代码。下面的内容是我自己总结的经验当然也看了尤大大的业务代码，自我感觉应该要这样去维护代码。所以出了这一篇文章

## 选项式API

vue2的选项式API因为每个选项都有固定的书写位置（比如数据就放在data里面，方法就放在methods里面），所以我们只需要将代码放到对应的选项中就行了。
 - 优点是因为已经固定了每个代码的书写位置，所有人写出来的代码风格都差不多。
 - 缺点是当单个组件的逻辑复杂到一定程度时，代码就会显得特别笨重，非常不灵活。
```js
<script>
export default {
  name: 'HelloWorld',
  components: {
    //组件
  },
  props: {
    //传入的props
  },
  data() {
    return {
      //data
    }
  },
  methods: {
    //methods
  },
  watch: {
    //watch
  },
  computed: {
    //computed
  },
  //一些生命周期
}
</script>
```

## 随意的Composition API
vue3推出了组合式 (Composition) API，他的主要特点就是非常灵活。解决了选项式API不够灵活的问题。但是灵活也是一把双刃剑，因为每个开发的编码水平不同。所以就出现了有的人使用组合式 (Composition) API写出来的代码非常漂亮和易维护，有的人写的代码确实很混乱和难易维护。
比如一个组件开始的时候还是规规矩矩的写，所有的ref响应式变量放在一块，所有的方法放在一块，所有的computed计算属性放在一块。
但是随着项目的不断迭代 ，或者干脆是换了一个人来维护。这时的代码可能就不是最开始那样清晰了，比如新加的代码不管是ref、computed还是方法都放到一起去了
```js
<script setup>
import { ref, computed } from 'vue'

const count1 = ref(0)
const doubleCount1 = computed(() => count1.value * 2)

const increment1 = () => {
  count1.value++
}
const count2 = ref(0)
const doubleCount2 = computed(() => count2.value * 2)
const increment2 = () => {
  count2.value++
}
</script>
```
这个时候你觉得这样子挺好的，其实我觉得这样子代码量少的确能看得懂，但是如果后续又有新加的呢来维护，那代码量就会特别多，而且代码的可读性就会降低

## 有序写的Composition API
```js
<script setup>
    import { ref, computed } from 'vue'

    const count1 = ref(0)
    const count2 = ref(0)
    const doubleCount1 = computed(() => count1.value * 2)
    const doubleCount2 = computed(() => count2.value * 2)

    const increment1 = () => {
    count1.value++
    }
    const increment2 = () => {
    count2.value++
    }
</script>
```
让每一个人遵循这种写法，这样 everyone can read it.但是这种写法也有大问题，我们打个比方比如这里的count特别多那他的computed和methods就会特别多，找到其对应的方法谈何容易not so easy.  那我们换个思路具体代码如下：
```js
<script setup>
import { ref, computed } from 'vue'

const count1 = ref(0)
//...很多个count
const count10 = ref(0)
const doubleCount1 = computed(() => count1.value * 2)
//...很多个doubleCount
const doubleCount10 = computed(() => count10.value * 2)
const increment1 = () => {
  count1.value++
}
//...很多个increment
const increment10 = () => {
  count10.value++
}
</script>
```
看到这个肯定有人想那你为什么不用`hooks`？直接把他封装成`useCount()`,这里用到了10个就直接用对应10个`hooks`文件,具体代码如下图：
```js
<script setup>
const {count1,doublecount1,increment1} = useCount1()
const {count2,doublecount2,increment2} = useCount2()
const {count3,doublecount3,increment3} = useCount3()
const {count4,doublecount4,increment4} = useCount4()
const {count5,doublecount5,increment5} = useCount5()
</script>
```
一般来说抽取出来的`hooks`都是用来多个组件进行逻辑共享，但是我们这里抽取出来的`useCount`文件明显只有这个vue组件会用他。达不到逻辑共享的目的，所以单独将这些逻辑抽取成名为`useCount`的`hooks`文件又有点不合适

## 最终解决方案

在学习那么多写法大家肯定心中也对代码维护上有了新的理解，确实有些写法上确实不太好维护，但是经过实践，我发现其实是有很好的解决方法的，这个方法也是我在看尤大大的业务代码的时候发现的，我们不如将前面的方案进行融合一下，抽取出多个`useCount`函数放在当前vue组件内，而不是抽成单个hooks文件。并且在多个`useCount`函数中我们还是按照前面约定的规范，按照顺序去写`ref`变量、`computed`等、函数的代码。
```js
<script setup>
const { count1, doublecount1, increment1 } = useCount1();
const { count2, doublecount2, increment2 } = useCount2();
const { count3, doublecount3, increment3 } = useCount3();
const { count4, doublecount4, increment4 } = useCount4();
const { count5, doublecount5, increment5 } = useCount5();

const useCount1 = () => {
  const count1 = ref(0);
  const doublecount1 = computed(() => count1.value * 2);
  const increment1 = () => {
    count1.value++;
  };
  return {
    count1,
    doublecount1,
    increment1,
  };
};
// useCount2
// useCount3
// ...
</script>
```
你们也可以看看尤雨溪本人的写的代码
[ gist.github.com](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e)
## 总结
本文主要讲解了我自己对`Composition API` 的理解，以及如何使用`Composition API` 解决书写难得问题。最后总结后规则如下

- 首先约定了一个代码规范，`Composition API`按照约定的顺序进行书写（书写顺序可以按照公司代码规范适当调整）。并且同一种组合式API的代码全部写在一个地方，比如所有的props放在一块、所有的`emits`放在一块、所有的`computed`放在一块。


- 如果逻辑能够多个组件复用就抽取成单独的`hooks`文件。


- 如果逻辑不能给多个组件复用，就将逻辑抽取成`useXXX`函数，将`useXXX`函数的代码还是放到当前组件中。
- 第一个好处是如果某天`useXXX`函数中的逻辑需要给其他组件复用，我们只需要将`useXXX`函数的代码移到新建的`hooks`文件中即可。
- 第二个好处是我们想查看某个业务逻辑的代码，只需要在对应的`useXXX`函数中去找即可。无需在整个vue文件中翻山越岭从`computed`模块的代码跳转到function函数的代码。



