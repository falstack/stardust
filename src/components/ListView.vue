<template>
  <view class="list-view">
    <template v-if="source">
      <!--  flow header  -->
      <slot
        :source="source"
        name="header"
      />
      <!--  flow list  -->
      <slot
        :list="source.result"
        :total="source.total"
        :count="source.result.length"
        :extra="source.extra"
      />
      <!--  flow footer  -->
      <slot
        :source="source"
        name="footer"
      />
      <!--  flow state  -->
      <view class="list-view__state">
        <!--   error   -->
        <template v-if="source.error">
          <view
            v-if="useFirstError && !source.result.length"
            class="list-view__state--first-error"
          >
            <slot
              name="first-error"
              :error="source.error"
            >
              出错了
            </slot>
          </view>
          <view
            v-else
            class="list-view__state--error"
            @click="retry"
          >
            <slot
              name="error"
              :error="source.error"
            >
              出错了，点击重试
            </slot>
          </view>
        </template>
        <!--   loading   -->
        <template v-else-if="source.loading">
          <view
            v-if="useFirstLoading && !source.result.length"
            class="list-view__state--first-loading"
          >
            <slot name="first-loading">
              加载中…
            </slot>
          </view>
          <view
            v-else
            class="list-view__state--loading"
          >
            <slot name="loading">
              加载中…
            </slot>
          </view>
        </template>
        <!--   nothing   -->
        <view
          v-else-if="source.nothing"
          class="list-view__state--nothing"
        >
          <slot name="nothing">
            这里什么都没有
          </slot>
        </view>
        <!--   no-more   -->
        <view
          v-else-if="source.noMore"
          class="list-view__state--no-more"
        >
          <slot
            v-if="displayNoMore"
            name="no-more"
          />
        </view>
        <!--   normal   -->
        <view
          v-else-if="!isPagination"
          class="list-view__state--load"
          @click="loadMore()"
        >
          <slot
            v-if="!isAuto"
            name="load"
          >
            点击加载更多
          </slot>
        </view>
      </view>
    </template>
    <view class="list-view__shim" />
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { utils, ENUM } from '@flowlist/js-core'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const NAMESPACE = 'list'

export default {
  name: 'ListView',
  props: {
    func: {
      required: true,
      type: [String, Function]
    },
    type: {
      type: String,
      default: ENUM.FETCH_TYPE.AUTO,
      validator: val => ~ENUM.FETCH_TYPE_ARRAY.indexOf(val)
    },
    query: {
      type: Object,
      default: () => {}
    },
    autoload: {
      type: Number,
      default: -1,
      validator: val => val >= -1
    },
    preload: {
      type: Number,
      default: 100,
      validator: val => val >= 0
    },
    cacheTimeout: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    uniqueKey: {
      type: String,
      default: ENUM.DEFAULT_UNIQUE_KEY_NAME
    },
    scrollX: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const store = useStore()

    const params = computed(() => {
      return {
        func: props.func,
        type: props.type,
        query: props.query,
        callback: _successCallback,
        uniqueKey: props.uniqueKey,
        cacheTimeout: props.cacheTimeout
      }
    })

    const source = computed(() => {
      return store.getters[`${NAMESPACE}/getFlow`](params.value)
    })

    const isAuto = computed(() => {
      if (!source.value) {
        return props.autoload === -1
      }
      return props.autoload === -1 || props.autoload > source.value.page
    })

    const isPagination = computed(() => {
      return props.type === ENUM.FETCH_TYPE.PAGINATION
    })

    const useFirstLoading = computed(() => {
      return !!ctx.slots['first-loading']
    })

    const useFirstError = computed(() => {
      return !!ctx.slots['first-error']
    })

    const displayNoMore = computed(() => {
      return !!ctx.slots['no-more']
    })

    const reset = (key, value) => {
      _callMethod({ key, value, method: ENUM.CHANGE_TYPE.RESET_FIELD })
    }

    const push = (value) => {
      _callMethod({ value, method: ENUM.CHANGE_TYPE.RESULT_ADD_AFTER })
    }

    const unshift = (value) => {
      _callMethod({ value, method: ENUM.CHANGE_TYPE.RESULT_ADD_BEFORE })
    }

    const patch = (value) => {
      _callMethod({ value, method: ENUM.CHANGE_TYPE.RESULT_LIST_MERGE })
    }

    const insertBefore = (id, value) => {
      _callMethod({ id, value, method: ENUM.CHANGE_TYPE.RESULT_INSERT_TO_BEFORE })
    }

    const insertAfter = (id, value) => {
      _callMethod({ id, value, method: ENUM.CHANGE_TYPE.RESULT_INSERT_TO_AFTER })
    }

    const remove = (id) => {
      _callMethod({ id, method: ENUM.CHANGE_TYPE.RESULT_REMOVE_BY_ID })
    }

    const search = (id) => {
      if (!props.source.value) {
        return undefined
      }
      return utils.searchValueByKey(props.source.value.result, id, props.uniqueKey)
    }

    const update = (id, key, value) => {
      _callMethod({ id, key, value, method: ENUM.CHANGE_TYPE.UPDATE_RESULT })
    }

    const jump = (page) => {
      return store.dispatch(
        `${NAMESPACE}/loadMore`,
        {
          ...params.value,
          query: { ...props.query, page }
        }
      )
    }

    const _initState = () => {
      if (source.value) {
        return
      }
      store.commit(`${NAMESPACE}/INIT_STATE`, params.value)
    }

    const _initFlowLoader = () => {
      if (props.autoload === 0) {
        return
      }

      initData()
    }

    const initData = (obj = {}) => {
      return new Promise(async (resolve) => {
        try {
          await store.dispatch(
            `${NAMESPACE}/initData`,
            {
              ...params.value,
              query: { ...props.query, ...obj }
            }
          )
          resolve()
        } catch (e) {
          _handleAsyncError(e)
          resolve()
        }
      })
    }

    const loadMore = (obj = {}) => {
      return new Promise(async (resolve) => {
        const query = { ...props.query, is_up: 0, ...obj }
        try {
          await store.dispatch(
            `${NAMESPACE}/loadMore`,
            {
              ...params.value,
              query
            }
          )
          resolve()
        } catch (e) {
          _handleAsyncError(e)
          resolve()
        }
      })
    }

    const loadBefore = (obj = {}) => {
      return loadMore({ ...obj, is_up: 1 })
    }

    const refresh = (showLoading = true) => {
      return new Promise(async (resolve) => {
        const query = { ...props.query }
        query.__refresh__ = true
        query.__reload__ = !showLoading
        try {
          await store.dispatch(
            `${NAMESPACE}/initData`,
            {
              ...params.value,
              query
            }
          )
          _initFlowLoader()
          resolve()
        } catch (e) {
          _handleAsyncError(e)
          resolve()
        }
      })
    }

    const retry = (showLoading = true) => {
      if (source.value.fetched) {
        return loadMore()
      } else {
        return initData({
          __refresh__: true,
          __reload__: !showLoading
        })
      }
    }

    const _callMethod = ({ method, id, key, value }) => {
      store.commit(
        `${NAMESPACE}/UPDATE_DATA`,
        {
          ...params.value,
          id,
          value,
          method,
          changeKey: key,
          uniqueKey: props.uniqueKey
        }
      )
    }

    const _fetchDataFn = () => {
      if (!source.value) {
        return
      }

      if (!this.isAuto) {
        return
      }

      if (source.value.loading || source.value.error) {
        return
      }

      if (source.value.noMore || source.value.nothing || (this.isPagination && source.value.fetched)) {
        // if (this.observer) {
        //   if (!shimRef) {
        //     return
        //   }
        //   this.observer.unobserve(shimRef)
        //   shimRef.__lazy_handler__ = undefined
        // }
        return
      }

      source.value.fetched ? this.loadMore() : this.initData()
    }

    const _handleAsyncError = (error) => {
      ctx.emit('error', { error })
    }

    const _successCallback = (data) => {
      ctx.emit('success', data)
    }

    onMounted(() => {
      _initState()
      _initFlowLoader()
    })

    return {
      source,
      params,
      isAuto,
      isPagination,
      useFirstLoading,
      useFirstError,
      displayNoMore,
      reset,
      push,
      unshift,
      patch,
      insertBefore,
      insertAfter,
      remove,
      search,
      update,
      jump,
      initData,
      loadMore,
      loadBefore,
      refresh,
      retry
    }
  },
  mounted() {
    // const ob = Taro.createIntersectionObserver(this.$el, {
    //   thresholds: [0]
    // })
    //
    // ob.relativeToViewport({ bottom: 0 }).observe('.list-view__shim', (e) => {
    //   console.log(e)
    //   if (e.intersectionRatio <= 0) {
    //     return
    //   }
    // })
    //
    // console.log(ob)
  }
  // watch: {
  //   query: {
  //     handler: function () {
  //       if (this.source) {
  //         return
  //       }
  //       this.$nextTick(() => {
  //         setTimeout(() => {
  //           this._initState()
  //           this._initFlowLoader()
  //         }, 0)
  //       })
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style lang="scss">
.list-view {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
