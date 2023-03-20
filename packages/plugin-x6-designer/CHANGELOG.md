# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.3-alpha.8](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.7...v1.0.3-alpha.8) (2023-02-08)

**Note:** Version bump only for package @alilc/lce-graph-x6-designer





## [1.0.3-alpha.7](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.6...v1.0.3-alpha.7) (2023-02-08)


### Bug Fixes

* 画布宽高根据main-area调整 ([2c3e659](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/2c3e659bfd0d120bc228ede9fc1d915409ade474))


### Features

* 调整自定义command方式 ([aa714a3](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/aa714a382a14f8723d910f6a74d17e2ca66735c0))





## [1.0.3-alpha.6](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.5...v1.0.3-alpha.6) (2023-01-31)

**Note:** Version bump only for package @alilc/lce-graph-x6-designer





## [1.0.3-alpha.5](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.4...v1.0.3-alpha.5) (2023-01-31)

**Note:** Version bump only for package @alilc/lce-graph-x6-designer





## [1.0.3-alpha.4](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.3...v1.0.3-alpha.4) (2023-01-31)

**Note:** Version bump only for package @alilc/lce-graph-x6-designer





## [1.0.3-alpha.3](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.2...v1.0.3-alpha.3) (2023-01-31)

**Note:** Version bump only for package @alilc/lce-graph-x6-designer





## [1.0.3-alpha.2](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.1...v1.0.3-alpha.2) (2023-01-31)

**Note:** Version bump only for package @ali/lce-graph-x6-designer





## [1.0.3-alpha.1](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.3-alpha.0...v1.0.3-alpha.1) (2023-01-30)


### Bug Fixes

* 修复 project.importSchema API 调用时，无法更新图编排视图 ([c50b45d](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/c50b45de8ca3d9bc790e3533ec55a0c41bfb4df5))





## [1.0.1-alpha.17](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.16...v1.0.1-alpha.17) (2022-12-30)


### Bug Fixes

* 注册 shape ([fafb69f](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/fafb69f42e734a76ab0fc641ea9ae10d2b4bc678))
* conflicts ([d2b5681](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/d2b5681f649297a9804b176f70a5c5599321050a))


### Features

* 移除 desinger 插件内的 tools 相关逻辑，线物料自定义，拆分 stencil 插件 ([3200969](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/3200969f8e5004686398aaad5cff8129f2bb3068))
* 在 Graph.registerNode 前进行 Graph.unregisterNode, 防止在多资源场景下由于注册重复的 node 导致报错 ([3dd5c91](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/3dd5c9189b772a79fd11ba3072dd87d962e79a6a))





## [1.0.1-alpha.16](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.15...v1.0.1-alpha.16) (2022-12-13)


### Features

* 支持多视图渲染 ([0d9e6bc](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/0d9e6bc73da59b204bb59acff31ae8414e9cdc59))





## [1.0.1-alpha.15](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.14...v1.0.1-alpha.15) (2022-10-24)

**Note:** Version bump only for package @ali/lce-graph-x6-designer





## [1.0.1-alpha.14](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.13...v1.0.1-alpha.14) (2022-10-21)

**Note:** Version bump only for package @ali/lce-graph-x6-designer





## [1.0.1-alpha.13](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.12...v1.0.1-alpha.13) (2022-09-27)


### Bug Fixes

* remove useless code ([5379336](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/53793366d9b14a7e5a286c10a1e20f32eda70715))


### Features

* 支持动态changeData ([976e7da](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/976e7daf3369e9b297ba10bd9e38f9bb1b567795))
* undo redo ([ee141a5](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/ee141a5a58d5fbd9d8657510d292d695c0a5927d))
* x6Designer onEdgeLabelRendered ([5703d91](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/5703d915259daa21b4b8bca0ba35936b47ed09ad))





## [1.0.1-alpha.12](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.11...v1.0.1-alpha.12) (2022-09-21)


### Features

* 删除common独立包，整合入tools ([a04a932](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/a04a932d9e3448b06e61a7fcbf3b62166f94fada))
* 删除common独立包，整合入tools ([1eca429](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/1eca4293c533e112c668961f05ee9721a154edb8))
* 删除common独立包，整合入tools ([4c0107b](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/4c0107b15e6754ad2efe2b5363aeb19bed1d8d38))





## [1.0.1-alpha.11](http://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.10...v1.0.1-alpha.11) (2022-09-19)


### Bug Fixes

* meterial pane name ([5df1d15](http://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/5df1d1542cec71ea84c478b24fbf2950b7820d89))





## [1.0.1-alpha.10](http://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.9...v1.0.1-alpha.10) (2022-09-19)


### Bug Fixes

* polyfill isPage function ([cdeba20](http://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/cdeba2076d5034075ebbc5ccea647082ac9d0bd3))





## [1.0.1-alpha.9](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.8...v1.0.1-alpha.9) (2022-09-17)


### Bug Fixes

* export schema ([0148658](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/0148658561bd97a7e2ffebf7134e75c3416d7ec2))





## [1.0.1-alpha.8](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.7...v1.0.1-alpha.8) (2022-09-15)


### Bug Fixes

* remove lowcode util dependencies ([5f18279](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/5f18279a9e5eefd94fa0880dc0d5670b837082ef))





## [1.0.1-alpha.7](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.6...v1.0.1-alpha.7) (2022-09-15)


### Features

* 改graph-react-renderer包名 ([718ba90](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/718ba90609aedc5c6f03d27d6f32c51b283951f7))





## [1.0.1-alpha.6](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.5...v1.0.1-alpha.6) (2022-09-15)

**Note:** Version bump only for package @ali/lce-graph-x6-designer





## [1.0.1-alpha.5](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.4...v1.0.1-alpha.5) (2022-09-15)


### Features

* remove useless & 必要包打包在内 ([407e22e](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/407e22e63f1bd5450fd221b0f40783228935cf6e))





## [1.0.1-alpha.4](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.3...v1.0.1-alpha.4) (2022-09-15)


### Features

* npm发布前build ([9e4905c](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/9e4905cfee9531e5b4fb62ad218f542f0abd4168))





## [1.0.1-alpha.3](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.2...v1.0.1-alpha.3) (2022-09-15)

**Note:** Version bump only for package @ali/lce-graph-x6-designer





## [1.0.1-alpha.2](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/compare/v1.0.1-alpha.0...v1.0.1-alpha.2) (2022-09-15)

**Note:** Version bump only for package @ali/lce-graph-x6-designer





## 1.0.1-alpha.0 (2022-09-15)


### Bug Fixes

* some ([f870527](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/f870527b6dc7feca7cc9f7020aed3706a572e8f1))
* x6拖入画布时position属性 ([415d029](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/415d02906d0fe900e160c8b35e4951ce6605a3c8))


### Features

* 调整目录，暂时删除demo-g6测试 ([6f20db7](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/6f20db7f4735f520fcdeb71703183c7cd1882808))
* 跑通放大缩小tool方式 ([bb6de84](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/bb6de84240d597e7d6d80bc561cf8cf7b27bbad8))
* 删除选中节点tool ([d018249](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/d01824992130d7de51072b48c8af942fb0633b1e))
* 用户自定义tool 注册方式跑通 ([6659840](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/6659840068af8f1e35571b4ae729b93fee127f81))
* diff更新节点直连走通 ([ed6e0fe](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/ed6e0fe3fdceb1c639cbbf05de5612096f6fff3c))
* init ([801ab85](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/801ab851a18c20382be3d9193855a155b0bd1396))
* Project architecture optimization ([034aff8](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/034aff88091905a305e2487e47a11cd9a990a828))
* remove status ([9fba329](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/9fba3295aaca35366fc6ff42a8ded126d6e2a37d))
* render section & extension api ([f856bbe](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/f856bbe344aff60e2601e6e895da91b19baa465d))
* support drag node ([360d7d9](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/360d7d947775036525f9e309b794a2d05ba9b6f9))
* use node view ([9c5c31b](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/9c5c31becedc68f535e72e7cf9ffa27d77428166))
* use open source lce & react component render x6 ([8678b7e](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/8678b7e6a099b78a5bc1cba7056f95fdebd5f411))
* x6 designer api ([8e10bf1](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/8e10bf1800ac55a2c6f25d98081ab8254403975f))
* x6剥离bootstrap依赖 ([ccd8230](https://gitlab.alibaba-inc.com/graph-editor-engine/graph-editor/commit/ccd8230525ae1f7997a0784e1a79ee37f4b3ad86))
