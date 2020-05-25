let Vue
class Router {
    constructor(options) {
        this.$options = options
        this.routerMap = {}
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }
    static install(_Vue) {
        Vue = _Vue
        Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }
    // 初始化
    init() {
        this.bindEvents()
        this.createRouteMap(this.$options)
        this.initComponent(Vue)
    }
    // 绑定事件
    bindEvents() {
        window.addEventListener('load', this.onHashChange.bind(this), false)
        window.addEventListener('hashchange', this.onHashChange.bind(this), false)
    }
    // 路由映射表
    createRouteMap(options) {
        options.routes.forEach(item => {
            this.routerMap[item.path] = item
        })
    }
    // 注册组件
    initComponent(Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            render() {
                return <a href={`#${this.to}`}>{this.$slots.default}</a>
            }
        })
        Vue.component('router-view', {
            render: h => {
                let component = this.routerMap[this.app.current].component
                return h(component)
            }
        })
    }
    // 获取路由path
    getHash() {
        return window.location.hash.slice(1) || '/'
    }
    // 获取跳转前的路径
    getFrom(e) {
        let from, to
        if (e.newUrl) {
            from = e.oldUrl.split('#')[1]
            to = e.newUrl.split('#')[1]
        } else {
            from = ''
            to = location.hash
        }
        return { from, to }
    }
    // 设置当前路径
    onHashChange(e) {
        let { from, to } = this.getFrom(e)
        let hash = this.getHash()
        let router = this.routerMap[hash]

        if (router.beforeEnter) {
            router.beforeEnter(to, from, () => {
                // 引起router-view重新render
                this.app.current = hash
            })
        } else {
            // ???
            this.app.current = hash
        }
    }

}

export default Router
