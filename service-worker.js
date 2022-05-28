/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "2fb8e34b391e5cb5c401fe9370f2919b"
  },
  {
    "url": "assets/css/0.styles.3af13d03.css",
    "revision": "3cf231b711ffdd04ad7f9a9b68414e7b"
  },
  {
    "url": "assets/img/bg.2cfdbb33.svg",
    "revision": "2cfdbb338a1d44d700b493d7ecbe65d3"
  },
  {
    "url": "assets/img/search.72b0ff46.svg",
    "revision": "72b0ff466169d7f6d483e301dcfe4c00"
  },
  {
    "url": "assets/js/1.5a85ab28.js",
    "revision": "3e725c01393322b28b3cc706eb8bbd58"
  },
  {
    "url": "assets/js/10.c36c3cdb.js",
    "revision": "ea64c20ea854e58bb44642636538e76e"
  },
  {
    "url": "assets/js/11.e2e2632a.js",
    "revision": "fa7f98e2f32e563b3720c171c57adcfa"
  },
  {
    "url": "assets/js/12.505ff660.js",
    "revision": "b4969ee57073087602bd1f72251eb0fb"
  },
  {
    "url": "assets/js/13.3e4bc995.js",
    "revision": "2f09b75baf5929e68010b9410d8238a8"
  },
  {
    "url": "assets/js/14.af159e50.js",
    "revision": "4cc96097332cb06ad8a7683688460628"
  },
  {
    "url": "assets/js/15.c39f49c3.js",
    "revision": "7bcdc9151eee18c747f2d5bbfb63994b"
  },
  {
    "url": "assets/js/16.8e9e4136.js",
    "revision": "261b6f81f1f0feb35408014a7148233a"
  },
  {
    "url": "assets/js/17.7dcf64a0.js",
    "revision": "f94ccb41a4820f4f614f7915bd403dd6"
  },
  {
    "url": "assets/js/18.068a6f2b.js",
    "revision": "b5717bb84c9b54af5ba4364f44d10e51"
  },
  {
    "url": "assets/js/19.eceb2180.js",
    "revision": "e2c7d833f16d8bbf04fde30a89cfba31"
  },
  {
    "url": "assets/js/20.3e86e9c3.js",
    "revision": "bd4c0101b41d58f6a96f2a8a3b82e137"
  },
  {
    "url": "assets/js/21.5ee4225b.js",
    "revision": "e1c5049bee89dac7c0e2e8ea4e6abbbc"
  },
  {
    "url": "assets/js/22.18cc5653.js",
    "revision": "cb95854bd107503744a71ecbf3e52ca6"
  },
  {
    "url": "assets/js/23.0c9de3dc.js",
    "revision": "2b5d6db77b878a7d9297584cc293f2da"
  },
  {
    "url": "assets/js/24.a5aa8ce8.js",
    "revision": "6efe43a013f58af1e5bbf7bb3a975279"
  },
  {
    "url": "assets/js/25.371a716c.js",
    "revision": "d0cec52d71051fd807c0509b09283115"
  },
  {
    "url": "assets/js/26.428f0f98.js",
    "revision": "7fdbbab4c46dee4bbd724425343a9b2d"
  },
  {
    "url": "assets/js/27.dc2d397e.js",
    "revision": "6f2eb0b07a1b41c800902faa24f12c2d"
  },
  {
    "url": "assets/js/28.f7809058.js",
    "revision": "d7e4ce3377f927353aaf2e7d4f59a2f8"
  },
  {
    "url": "assets/js/29.932ce435.js",
    "revision": "5a51cf973c222db0e6c81846c52e7451"
  },
  {
    "url": "assets/js/3.97cb735a.js",
    "revision": "66d922b4ca9536ad139eb29aedf6761d"
  },
  {
    "url": "assets/js/30.a7f3e374.js",
    "revision": "56a0234bd47d1cde81bd0fb0c43414ff"
  },
  {
    "url": "assets/js/31.4dd6c844.js",
    "revision": "9d527d082f64a7df778b286b94595c6c"
  },
  {
    "url": "assets/js/32.fd8229f3.js",
    "revision": "3903dfe091bb5d463a47331fa25c9b4c"
  },
  {
    "url": "assets/js/33.0387074c.js",
    "revision": "693689dfcdd0d5f17dd67189732e7d8b"
  },
  {
    "url": "assets/js/34.ccd455a9.js",
    "revision": "f14a636b2ac93b77f5fc172f0549bc59"
  },
  {
    "url": "assets/js/35.e5242931.js",
    "revision": "dc3e53eb834d882c281cad686f0ad74e"
  },
  {
    "url": "assets/js/36.b9c81afb.js",
    "revision": "8eed3fa9dd959a7f4b9e4fcfa9aadc8d"
  },
  {
    "url": "assets/js/37.990e3439.js",
    "revision": "679f027a3cae369b1695ccf0934eb1cb"
  },
  {
    "url": "assets/js/38.9854b0c0.js",
    "revision": "9163a4ca8f7d28cebd64959602fe6d6a"
  },
  {
    "url": "assets/js/39.44a7827c.js",
    "revision": "ff5615609fbf3aaf848bb09f60325c88"
  },
  {
    "url": "assets/js/4.fd8c8808.js",
    "revision": "5877946461a6d6575241439de614d095"
  },
  {
    "url": "assets/js/40.a078069b.js",
    "revision": "252255aef01d4a1741ed8277b3df7bae"
  },
  {
    "url": "assets/js/41.40e7349c.js",
    "revision": "c6f3f709e7a3fb2867a2da2001e5705b"
  },
  {
    "url": "assets/js/42.a3dd40b7.js",
    "revision": "76224336aa6bbaaded55aff2f461611a"
  },
  {
    "url": "assets/js/43.19f9e3a1.js",
    "revision": "bec2828f9b22385c26808b4c3b76a9fe"
  },
  {
    "url": "assets/js/5.71556fb3.js",
    "revision": "d259aa4991e4571fe7518f3671248ccd"
  },
  {
    "url": "assets/js/6.100e6bd9.js",
    "revision": "4ee9151e86f1690b6fa48777b76a5c7d"
  },
  {
    "url": "assets/js/7.3873c60b.js",
    "revision": "eedf755734c240c423164a6b4d25663c"
  },
  {
    "url": "assets/js/8.6dce9ba3.js",
    "revision": "161c1d689495c7bda88f26753c3ee481"
  },
  {
    "url": "assets/js/9.d9e9496f.js",
    "revision": "3b131d97c515f1301bbc1ebfe7732ab9"
  },
  {
    "url": "assets/js/app.0363758a.js",
    "revision": "2c4fc22f8a1b1e270de58b4bedcbce3a"
  },
  {
    "url": "background.png",
    "revision": "f0cb5c6080cc533cce01b7a7182940fe"
  },
  {
    "url": "blogs/about.html",
    "revision": "290d22101d14443213b7690c10e1fae9"
  },
  {
    "url": "categories/index.html",
    "revision": "e5d5055562de6fa02e1767d6f6f54daf"
  },
  {
    "url": "docs/development_doc/plugins.html",
    "revision": "5c21ded7ef7646a318c501148efb3622"
  },
  {
    "url": "docs/development_doc/shop_handle.html",
    "revision": "f5b21d3a9db34d8585280faa0f7e7f80"
  },
  {
    "url": "docs/development_doc/task_control.html",
    "revision": "8cc18d43138fe9a31b1783d790fbec93"
  },
  {
    "url": "docs/development_doc/utils.html",
    "revision": "6c8378a3878266a15cee72a0b5edd828"
  },
  {
    "url": "docs/faq/index.html",
    "revision": "268fd8ff58ecf60f2269b5dff3cf57ab"
  },
  {
    "url": "docs/help_doc/basic_plugins/admin_plugins.html",
    "revision": "1d6d2c4aead7964f5751b766d24fa5e8"
  },
  {
    "url": "docs/help_doc/basic_plugins/common_plugins.html",
    "revision": "8de3f0b1dba0d45ddd6cfe6dda89514b"
  },
  {
    "url": "docs/help_doc/basic_plugins/other_plugins.html",
    "revision": "fd55284c1c15587398de6b50e88571dc"
  },
  {
    "url": "docs/help_doc/basic_plugins/shop_plugins.html",
    "revision": "934e430189cb695f281e3602066b841c"
  },
  {
    "url": "docs/help_doc/basic_plugins/superuser_plugins.html",
    "revision": "14aee9ac9a1f10b59995ce59cc11b3ed"
  },
  {
    "url": "docs/help_doc/configs.html",
    "revision": "09828a73df291feae6146a37fb9aff84"
  },
  {
    "url": "docs/help_doc/index.html",
    "revision": "db18418441ce5626439efbff605c72c6"
  },
  {
    "url": "docs/help_doc/plugins_index.html",
    "revision": "0ff485c8a45b85249693c89473f39941"
  },
  {
    "url": "docs/help_doc/public_plugins/admin_plugins.html",
    "revision": "3c25da3bb044e7b3a06de95c2e306525"
  },
  {
    "url": "docs/help_doc/public_plugins/common_plugins/common_plugins.html",
    "revision": "6990718cc7cc8f2e4826be77df2c8320"
  },
  {
    "url": "docs/help_doc/public_plugins/draw_card_plugins/draw_card_plugins.html",
    "revision": "ed3e8801ea439a72d283cc0110721722"
  },
  {
    "url": "docs/help_doc/public_plugins/game_plugins/game_plugins.html",
    "revision": "c3c5df140a14913ef10165b1ed46be66"
  },
  {
    "url": "docs/help_doc/public_plugins/genshin_plugins/genshin_plugins.html",
    "revision": "f169f4744f5209ae784704666c107496"
  },
  {
    "url": "docs/help_doc/public_plugins/other_plugins/other_plugins.html",
    "revision": "15a93b3704cf44a0aaeb886936ee7901"
  },
  {
    "url": "docs/help_doc/public_plugins/pic_plugins/pic_plugins.html",
    "revision": "de814bbe9c3ee5b8ef9680573c0dd552"
  },
  {
    "url": "docs/help_doc/public_plugins/superuser_plugins.html",
    "revision": "3913bd683bc77c70ef5e745f9dfacb87"
  },
  {
    "url": "docs/help_doc/public_plugins/utils_plugins/utils_plugins.html",
    "revision": "f0a52fb1ddecd3094fd5a76c82b41021"
  },
  {
    "url": "docs/index.html",
    "revision": "b7b801aad092448a17766393a3a5dbae"
  },
  {
    "url": "docs/installation_doc/index.html",
    "revision": "5f5c1b4c0cac8383f5e456de3417feea"
  },
  {
    "url": "docs/installation_doc/install_gocq.html",
    "revision": "586dd6c26648260dc6a390bb22a17275"
  },
  {
    "url": "docs/installation_doc/install_postgresql.html",
    "revision": "8263a64515ecb89447bcf8341eabcae0"
  },
  {
    "url": "docs/installation_doc/install_webui.html",
    "revision": "8641d33280d4cd3538208d5ce641ae3c"
  },
  {
    "url": "docs/installation_doc/install_zhenxun.html",
    "revision": "8f2d83ca6370f57eeaa60c8c73f819ff"
  },
  {
    "url": "docs/installation_doc/start_.html",
    "revision": "086c16c2fbd885b2a6fcca32cd6cbde5"
  },
  {
    "url": "docs/update_log/index.html",
    "revision": "a0e18287e16d232887fe1c8915f80239"
  },
  {
    "url": "gocq/gocq0.png",
    "revision": "9ea372dcebceef63ef360d120c0eb898"
  },
  {
    "url": "gocq/gocq1.png",
    "revision": "4694d1a7821898b8621582f34c20c199"
  },
  {
    "url": "gocq/gocq2.png",
    "revision": "d2cdf4f890af39c5e3789485bb7ad493"
  },
  {
    "url": "index.html",
    "revision": "2f9b0a296503f231539452a4b8cb475a"
  },
  {
    "url": "logo.png",
    "revision": "247217ec9f22445d8f14aedcd1eb1b3f"
  },
  {
    "url": "tag/index.html",
    "revision": "0b4bf9968de579aad4a356d976b8b40e"
  },
  {
    "url": "timeline/index.html",
    "revision": "7fb0e4261e0afdaf5b15e92c7c0ee6d1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
