# weex

* export default  和 一般export的区别

* vue [单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)

* weex debug 失败报错 [Failed to download Chromium](https://github.com/weexteam/weex-toolkit/issues/275)




```
function Foo() {
    getName = function(){alert(1);};
	return this;
}
Foo.getName = function(){alert(2)};
Foo.prototype.getName = function(){alert(3)};
var getName = function(){alert(4)};
function getName(){alert(5)};

Foo.getName();  2

getName(); 4

Foo().getName(); 1
getName(); 1
new Foo.getName(); 2
new Foo().getName();3
new new Foo().getName();3
```