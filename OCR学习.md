# OCR学习

## 术语

* CTPN -  Detecting text in natural image with **connectionist text proposal network**.
* SPP - **Spatial Pyramid Pooling**
* ROI - **Region of Interest**
* RPN - **Region Proposal Network**
* SSD - **Single Shot MultiBox Detector**
* CRNN - 
* Fast-RCNN -
* EAST - 
* DB - **Differentiable Binarization**
* CML - collaboration mutual learning 协作相互学习
* U-DML -  unified deep mutual learning 统一深度相互学习
* GT - ground truth 地面实况 指的是为当前测试收集适当的目标（可证明的）数据的过程

## 参考资料

* [ RPN（Region Proposal Network）和 Anchor 理解_anchor和proposal](https://blog.csdn.net/qq_35586657/article/details/97956189)

* [ ROI Pooling 与 SPP 理解](https://blog.csdn.net/qq_35586657/article/details/97885290)

* [ROI Pooling和ROI Align - 知乎](https://zhuanlan.zhihu.com/p/73138740)

* [SSD目标检测 - 知乎](https://zhuanlan.zhihu.com/p/31427288)

* [iOS 工程示例 — Paddle-Lite 文档](https://paddle-lite.readthedocs.io/zh/develop/demo_guides/ios_app_demo.html)

* [macOS 环境下编译适用于 iOS 的库 — Paddle-Lite 文档](https://paddle-lite.readthedocs.io/zh/develop/source_compile/macos_compile_ios.html)

* [深度学习网络中backbone 端到端是什么意思? - 知乎](https://www.zhihu.com/question/399611596)

* [ios ocr demo by xxlyu-2046 · Pull Request #81 · PaddlePaddle/Paddle-Lite-Demo](https://github.com/PaddlePaddle/Paddle-Lite-Demo/pull/81)
* [猫识别demo](https://github.com/PaddlePaddle/Paddle-Lite-Demo)

* [PP-OCRv2论文阅读笔记 - 知乎](https://zhuanlan.zhihu.com/p/408630840)
* [PP-OCR系统解析实战 - 飞桨AI Studio - 人工智能学习实训社区](https://aistudio.baidu.com/aistudio/projectdetail/3491465)

* [安全帽检测YoloV3模型在树莓派上的部署教程](https://github.com/PaddleCV-FAQ/PaddleDetection-FAQ/blob/main/Lite%E9%83%A8%E7%BD%B2/yolov3_for_raspi.md)
* [如何用树莓派4B与Paddle Lite实现实时口罩识别？ - 极术社区 - 连接开发者与智能计算生态](http://aijishu.com/a/1060000000252524)

文本检测 - 文本识别 

[PP-OCR模型训练](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.4/doc/doc_ch/training.md#%E5%9E%82%E7%B1%BB%E5%9C%BA%E6%99%AF)

文本检测模型训练[PaddleOCR/detection.md at release/2.4 · PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.4/doc/doc_ch/detection.md) 

[配置文件内容与生成](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.4/doc/doc_ch/config.md)

模型库概览[PaddleClas/models_intro.md at release/2.0 · PaddlePaddle/PaddleClas](https://github.com/PaddlePaddle/PaddleClas/blob/release/2.0/docs/zh_CN/models/models_intro.md)

[Paddle Lite 预测流程 — Paddle-Lite documentation](https://paddlelite.paddlepaddle.org.cn/quick_start/tutorial.html)

转换为lite支持的nb模型文件[使用可执行文件 opt](https://paddlelite.paddlepaddle.org.cn/user_guides/opt/opt_bin.html) [模型优化opt](https://github.com/PaddlePaddle/PaddleOCR/blob/95c670faf6cf4551c841764cde43a4f4d9d5e634/deploy/lite/readme.md)

pip3 install opencv-contrib-python-headless==4.4.0.46 -i https://mirror.baidu.com/pypi/simple

[文本检测识别标注](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.4/PPOCRLabel/README_ch.md)

[ PaddleLite 文档macOS 环境下编译适用于 iOS 的库 — Paddle-Lite documentation](https://paddlelite.paddlepaddle.org.cn/source_compile/macos_compile_ios.html)

[它会不会成为 OCR 领域霸主？ - 掘金](https://juejin.cn/post/6909366513124245511)

Log  lr = 学习率

如果矩阵type为CV_8UC3，rows=100,cols=100如果调用uchar泛型的at函数来访问矩阵元素最后元素可以访问到image.at<uchar>(99, 299)，其实type对应的泛型类型应该为cv::Vec3b，具体type与泛型对应关系在此[OpenCV 矩阵元素的数据类型](https://www.jianshu.com/p/204f292937bb)

[一文理解 YUV - 知乎](https://zhuanlan.zhihu.com/p/75735751)

[ARM Neon 指令 解释 - 知乎](https://zhuanlan.zhihu.com/p/27334213)

```c++
 //打印矩阵

cv::print(cv::format(img, cv::Formatter::FMT_NUMPY));
```

```
python3 tools/train.py -c configs/det/ch_ppocr_v2.0/ch_det_mv3_db_v2.0.yml -o Global.pretrained_model=./pretrain_models/MobileNetV3_large_x0_5_pretrained

python3 tools/infer_det.py -c configs/det/ch_ppocr_v2.0/ch_det_mv3_db_v2.0.yml -o Global.infer_img="./doc/imgs_en/0011.jpeg" Global.pretrained_model="./output/ch_db_mv3/best_accuracy"
```

```
./opt --print_model_ops=true --valid_targets=arm --model_file=/Users/blackchena/Downloads/ch_ppocr_mobile_v2.0_cls_infer/inference.pdmodel --param_file=/Users/blackchena/Downloads/ch_ppocr_mobile_v2.0_cls_infer/inference.pdiparams

./opt --model_file=/Users/blackchena/Downloads/ch_ppocr_mobile_v2.0_cls_infer/inference.pdmodel --param_file=/Users/blackchena/Downloads/ch_ppocr_mobile_v2.0_cls_infer/inference.pdiparams --valid_targets=arm --optimize_out_type=naive_buffer --optimize_out=ch_ppocr_mobile_v2_cls_opt

./opt --model_file=/Users/blackchena/Downloads/ch_PP-OCRv2_det_infer/inference.pdmodel --param_file=/Users/blackchena/Downloads/ch_PP-OCRv2_det_infer/inference.pdiparams --valid_targets=arm --optimize_out_type=naive_buffer --optimize_out=ch_ppocr_mobile_v2_det_opt

./opt --model_file=/Users/blackchena/Downloads/ch_PP-OCRv2_rec_infer/inference.pdmodel --param_file=/Users/blackchena/Downloads/ch_PP-OCRv2_rec_infer/inference.pdiparams --valid_targets=arm --optimize_out_type=naive_buffer --optimize_out=ch_ppocr_mobile_v2_rec_opt
```

[OC之AVCapturePhotoOutput - 简书](https://www.jianshu.com/p/83a55032c657)

[Video Toolbox：读写解码回调函数CVImageBufferRef的YUV图像 - 🌞Bob - 博客园](https://www.cnblogs.com/isItOk/p/5964639.html)

[修正UIImage的Orientation属性 - 简书](https://www.jianshu.com/p/df094c044096)

[交叉编译tesseract-ocr到iOS平台 | 果博](http://blog.aiguor.com/notes/177.html)



![image-20220316151154565](/Users/blackchena/Library/Application Support/typora-user-images/image-20220316151154565.png)