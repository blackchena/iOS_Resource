# Image Index Generator 设计

## 目标

在 VS Code 资源管理器中，用户右键单击文件夹后可运行“生成图片索引”，在该文件夹写入 `index.js`。

## 架构

插件位于 `image-index-generator`。扩展入口通过相对路径动态导入兄弟目录 `alfred-plugins/alfred-toolkit/tools/img-index-generate.js`，直接复用其 `collectImageFiles` 与 `renderImageIndex` 导出函数，不复制或改动该脚本。

命令仅接受资源管理器提供的文件夹 URI：读取文件列表、渲染索引、写入所选文件夹的 `index.js`，并在成功时打开文件；脚本抛出的目录或命名冲突错误会显示给用户。

## 交互与错误处理

- 菜单仅出现在资源管理器的文件夹上下文菜单中。
- 生成结果固定为所选文件夹下的 `index.js`，会覆盖同名文件。
- 成功提示包含图片数量，并打开生成文件。
- 空文件夹仍生成合法的空索引。
- 失败以 VS Code 错误提示展示原始错误信息。

## 验证

以 Node 内置测试覆盖核心生成协调逻辑：正常写入、空图片目录与脚本抛错。再执行 TypeScript 编译与测试命令，确认扩展可被打包前构建。
