# Vue-element-admin中的权限问题

进入今天的学习，我觉得大家接触的第一个前端项目可能也会是中后台管理系统，我在实习过程中就是一个B端的管理系统，今天我们就来彻底探讨关于权限这个问题我们怎么去解决主要分为俩个模块   1.页面级别的权限 2.按钮级别的权限

## 登录

在开始聊权限之前我们先来聊一下登录：随便造俩个基本input控件一个用来用来输入账号一个用来密码登录按钮，然后我们点击登录按钮的时候，会调用一个接口，接口返回一个token(身份的唯一标识符),当然我们需要将这个token保存起来，下次登录的时候直接从本地存储中取出来，然后发送给后端接口，后端接口会验证token是否正确，如果正确就返回用户信息userInfo（用户权限，用户名等信息）

## 页面级别的权限验证

在拿到userinfo的时候，这个时候我们就要考虑根据不同的role我们需要给出对应的权限路由，这个时候怎么去给出这个路由就很关键，有好几种技术方案 1.后端自己判断给出对应role的路由表 2.前端把所有页面路由全部写进路由表，然后根据role去做页面的拦截 3.前端根据role权限动态生成路由

**1. 后端自己处理给出对应role的路由表**

也就是ssr服务端渲染方案，我们前端只需要拿到对应路由表然后塞进router中就可以了，听上去是一个很棒的方案，但是对应我们前端开发过程中相当困难，现在都是前后端分离，这样子开发对于开发体验和效率上很差

**2.前端把所有页面路由全部书写出来，然后根据role去做页面的拦截**
用户登录成功之后，我们会在全局钩子router.beforeEach中拦截路由，用userinfo判断用户权限和to.meta.role做对比（在路由表设计中meta定义perimissions表，根据业务情况来设计当然复杂的话你也可以定义function都可以当然这里比较难可以先不掌握），如果权限足够就跳转到对应的页面，如果权限不够就跳转到403页面，当然我们在做权限判断之前肯定先去校验有没有token和访问的路由页面是否在白名单当中。这种技术方案优点在于可以完美解决页面权限问题，且告知用户为什么权限不够，但是缺点在于代码维护上非常麻烦，里面做了很多if else 判断

**3.前端根据role动态生成路由**
随着vue2.2之后有了router.addRoutes动态添加路由，我们可以在登录成功之后，根据用户权限动态生成路由，然后动态添加到router中，这样我们就可以做到动态生成路由，然后根据权限动态生成路由，具体实现思路是在vuex当中获取当前role的权限，然后根据权限动态生成路由，然后动态添加到router中，将不需要挂载的路由直接丢弃，这样的好处在代码维护上省去了大量的if else因为方案2需要做很多判断，但是缺点就是因为路由没有去挂载所以如果用户没有权限还去访问了这个地址他只会404并不会去报403用户不知道自己是怎么回事，以为大家都不可以并不是因为自己'没充钱'导致的，403则可以表示页面是有的的 但是就是因为自己没权限导致的.这种技术方案就达不到产品设计的初心尤其是在c端产品上

````md
```js
// store/permission.js
import { asyncRouterMap, constantRouterMap } from 'src/router';

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          if (roles.indexOf('admin') >= 0) return true;
          if (hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;
```

#通过用户的权限和之前在router.js里面asyncRouterMap的每一个页面所需要的权限做匹配，最后返回一个该用户能够访问路由有哪些
````


## 按钮级别的权限验证(组件内部权限控制)

在组件内部根据权限控制元素的显示：

**技术方案一:**

你可以在 Vue 3 项目中使用 Vue Router 和 Pinia 实现页面权限的判断和控制。


```vue
<template>
  <div>
    <h1>Dashboard</h1>
    <button v-if="hasPermission('edit_profile')">Edit Profile</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useUserStore } from '../stores/user';

export default defineComponent({
  setup() {
    const userStore = useUserStore();

    const hasPermission = (permission) => {
      return userStore.userPermissions.includes(permission);
    };

    return {
      hasPermission
    };
  }
});
</script>
```

### 完整代码示例

**main.js**
```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
```

**App.vue**
```vue
<template>
  <router-view></router-view>
</template>
```

**views/Home.vue**
```vue
<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
```

**views/Dashboard.vue**
```vue
<template>
  <div>
    <h1>Dashboard</h1>
    <button v-if="hasPermission('edit_profile')">Edit Profile</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useUserStore } from '../stores/user';

export default defineComponent({
  setup() {
    const userStore = useUserStore();

    const hasPermission = (permission) => {
      return userStore.userPermissions.includes(permission);
    };

    return {
      hasPermission
    };
  }
});
</script>
```

**views/Login.vue**
```vue
<template>
  <div>
    <h1>Login</h1>
  </div>
</template>
```

**技术方案二:**
利用Dom元素来控制页面元素的显示和隐藏也就是自定义指令

```javascript
// directives/permission.js
import { useUserStore } from '../stores/user';

const permissionDirective = {
  mounted(el, binding) {
    const userStore = useUserStore();
    const permission = binding.value;

    if (!userStore.permissions.includes(permission)) {
      el.style.display = 'none';
    }
  }
};

export default permissionDirective;
```

 1. 在 `main.js` 中注册指令 

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import permissionChecker from './permissionChecker';
import permissionDirective from './directives/permission'; // 引入权限指令

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(permissionChecker);

app.directive('permission', permissionDirective);

app.mount('#app');
```

2.在组件中使用指令


```vue
<template>
  <div>
    <h1>Dashboard</h1>
    <button v-permission="'edit_profile'">Edit Profile</button>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
```
**技术方案三:**

创建一个全局方法来检查权限：

```javascript
// permissionChecker.js
import { useUserStore } from './stores/user';

const userStore = useUserStore();
const hasPermission = (permission) => {
  return userStore.permissions.includes(permission);
};

export default {
  install(app) {
    app.config.globalProperties.$hasPermission = hasPermission;
  }
};
```

在 `main.js` 中注册全局方法

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import permissionChecker from './permissionChecker'; // 引入权限检查方法

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(permissionChecker);

app.mount('#app');
```


