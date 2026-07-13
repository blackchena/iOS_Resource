# Image Index Generator

在 VS Code 的资源管理器中右键单击一个本地文件夹，选择“生成图片索引”，即可在该文件夹生成 `index.js`。

插件通过相对路径加载 `../../alfred-plugins/alfred-toolkit/tools/img-index-generate.js`，直接复用其中的图片扫描与索引渲染逻辑。因此使用此插件时，需要保留当前 `VSCode` 与 `alfred-plugins` 的相对目录结构。

生成成功后会自动打开 `index.js`；如果图片名称转换后发生冲突，VS Code 会显示对应错误。
