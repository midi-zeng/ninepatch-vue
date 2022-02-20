import { NinePatchCore } from 'nine-patch-core';

//

var script = {
  name: 'nine-patch',
  data () {
    return {
      padding: {},
      borderImageData: {},
      clipPath: 0
    }
  },
  props: {
    src: {
      type: String,
      required: true,
      default: ''
    }
  },
  watch: {
    src: {
      hanlder() {
        this.getNinePatchData();
      },
      immediate: true
    }
  },
  methods: {
    async getNinePatchData() {
      if (this.src === '' || this.src === undefined) {
        return false
      }

      // 自定义传入border-image参数的不用去解析图片
      if (this.customOptions) {
        this.padding = this.customOptions?.padding ?? {};
        this.borderImageData = this.customOptions?.borderImageSlice ?? {};
        this.clipPath = this.customOptions?.clipPath ?? '';
      } else {
        const np = new NinePatchCore(this.src);
        const chunk = await np.getChunkData();
        this.padding = chunk?.padding ?? {};
        this.borderImageData.top = chunk.yDivs.start;
        this.borderImageData.right = chunk.width - chunk.xDivs.stop;
        this.borderImageData.bottom = chunk.height - chunk.yDivs.stop;
        this.borderImageData.left = chunk.xDivs.start;
        this.clipPath = chunk?.clipPath ?? 0;
      }
    }
  },
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      class: _vm.$style.container,
      style:
        "\n    border-image-source: url(" +
        _vm.src +
        ");\n    padding: " +
        _vm.padding.top +
        "px " +
        _vm.padding.right +
        "px " +
        _vm.padding.bottom +
        "px " +
        _vm.padding.left +
        "px;\n    border-image-slice: " +
        _vm.borderImageData.top +
        " " +
        _vm.borderImageData.right +
        " " +
        _vm.borderImageData.bottom +
        " " +
        _vm.borderImageData.left +
        " fill;\n    border-image-width: " +
        _vm.borderImageData.top +
        "px " +
        _vm.borderImageData.right +
        "px " +
        _vm.borderImageData.bottom +
        "px " +
        _vm.borderImageData.left +
        "px;\n    clip-path: inset(" +
        _vm.clipPath +
        "px)\n  ",
    },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-61a318fe_0", { source: "\n.container[data-v-61a318fe] {\n  color: aqua;\n}\n", map: {"version":3,"sources":["/Users/zengfukun/data/code/github/ninepatch-vue/src/app.vue"],"names":[],"mappings":";AAqEA;EACA,WAAA;AACA","file":"app.vue","sourcesContent":["<template>\n  <div\n    :class=\"$style.container\"\n    :style=\"`\n      border-image-source: url(${src});\n      padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;\n      border-image-slice: ${borderImageData.top} ${borderImageData.right} ${borderImageData.bottom} ${borderImageData.left} fill;\n      border-image-width: ${borderImageData.top}px ${borderImageData.right}px ${borderImageData.bottom}px ${borderImageData.left}px;\n      clip-path: inset(${clipPath}px)\n    `\"\n  >\n    <slot />\n  </div>\n</template>\n\n<script>\nimport { NinePatchCore } from 'nine-patch-core'\n\nexport default {\n  name: 'nine-patch',\n  data () {\n    return {\n      padding: {},\n      borderImageData: {},\n      clipPath: 0\n    }\n  },\n  props: {\n    src: {\n      type: String,\n      required: true,\n      default: ''\n    }\n  },\n  watch: {\n    src: {\n      hanlder() {\n        this.getNinePatchData()\n      },\n      immediate: true\n    }\n  },\n  methods: {\n    async getNinePatchData() {\n      if (this.src === '' || this.src === undefined) {\n        return false\n      }\n\n      // 自定义传入border-image参数的不用去解析图片\n      if (this.customOptions) {\n        this.padding = this.customOptions?.padding ?? {}\n        this.borderImageData = this.customOptions?.borderImageSlice ?? {}\n        this.clipPath = this.customOptions?.clipPath ?? ''\n      } else {\n        const np = new NinePatchCore(this.src)\n        const chunk = await np.getChunkData()\n        this.padding = chunk?.padding ?? {}\n        this.borderImageData.top = chunk.yDivs.start\n        this.borderImageData.right = chunk.width - chunk.xDivs.stop\n        this.borderImageData.bottom = chunk.height - chunk.yDivs.stop\n        this.borderImageData.left = chunk.xDivs.start\n        this.clipPath = chunk?.clipPath ?? 0\n      }\n    }\n  },\n}\n</script>\n\n<style scoped>\n.container {\n  color: aqua;\n}\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-61a318fe";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export { __vue_component__ as default };
