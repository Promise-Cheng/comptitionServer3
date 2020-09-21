/*
 Navicat Premium Data Transfer

 Source Server         : LAPTOP-DMJRNMLN
 Source Server Type    : MySQL
 Source Server Version : 80016
 Source Host           : localhost:3306
 Source Schema         : compprojtest

 Target Server Type    : MySQL
 Target Server Version : 80016
 File Encoding         : 65001

 Date: 29/06/2020 13:28:36
*/
CREATE DATABASE /*!32312 IF NOT EXISTS*/`compwebproj` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `compwebproj`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for compcode
-- ----------------------------
DROP TABLE IF EXISTS `compcode`;
CREATE TABLE `compcode`  (
  `CompTypeid` int(11) NOT NULL AUTO_INCREMENT,
  `CompName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `CompIntr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`CompTypeid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of compcode
-- ----------------------------
INSERT INTO `compcode` VALUES (1, 'ACM', '大学生程序设计大赛');
INSERT INTO `compcode` VALUES (2, '电子竞赛', '电子竞赛');
INSERT INTO `compcode` VALUES (3, '服务外包', '大学生服务外包竞赛');
INSERT INTO `compcode` VALUES (4, '数学建模', '全国数学建模比赛');

-- ----------------------------
-- Table structure for competition
-- ----------------------------
DROP TABLE IF EXISTS `competition`;
CREATE TABLE `competition`  (
  `CompId` int(11) NOT NULL AUTO_INCREMENT,
  `compName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `CompTypeid` int(11) NULL DEFAULT NULL,
  `startTime` datetime(0) NULL DEFAULT NULL,
  `endTime` datetime(0) NULL DEFAULT NULL,
  `compIntro` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `personNum` int(11) NULL DEFAULT NULL,
  `compStateID` int(11) NULL DEFAULT NULL,
  `teacher` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `obStartTIme` datetime(0) NULL DEFAULT NULL,
  `obEndTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`CompId`) USING BTREE,
  INDEX `FK_Reference_11`(`CompTypeid`) USING BTREE,
  INDEX `FK_Reference_12`(`compStateID`) USING BTREE,
  CONSTRAINT `FK_Reference_11` FOREIGN KEY (`CompTypeid`) REFERENCES `compcode` (`CompTypeid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Reference_12` FOREIGN KEY (`compStateID`) REFERENCES `compstatus` (`compStateID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '竞赛信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competition
-- ----------------------------
INSERT INTO `competition` VALUES (1, '1206', 1, '2018-12-06 12:55:44', '2018-12-06 21:58:03', '<p>这是1206的第一次测试。</p>', 1, 5, '钟老师', '2018-12-06 21:55:51', '2018-12-06 21:57:32');
INSERT INTO `competition` VALUES (2, '0107', 1, '2019-01-07 15:08:47', '2019-01-07 16:59:13', '<p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">一，项目需求</font></font></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">在开发过程中，由于技术的不断迭代，为了提高开发效率，需要对原有项目的架构做出相应的调整。</font></font></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">二，存在的问题</font></font></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">为了不影响项目进度，架构调整初期只是把项目做了简单的maven管理，引入springboot并未做春云微服务处理。但随着项目的进一步开发，急需拆分现有业务，做微服务处理。因此架构上的短板日益突出.spring cloud config无法完全应用，每次项目部署需要修改大量配置文件。严重影响开发效率，因此便萌生了对项目架构再次调整的决心。</font></font></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">三，调整建议</font></font></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">为了兼容以前的代码版本，尽量不修改现有的代码结构，以免增加额外的工作量并且为了更好的应用云配置。</font></font></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">首先，创建JdbcConfigBean类，用以读取配置文件，实例代码入如下（仅供参考）：</font></font></p><p><br /></p><p><br /></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">--------------------- </font></font></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">作者：希尔伯特 </font></font></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">来源：CSDN </font></font></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">原文：HTTPS：//blog.csdn.net/weixin_35971547/article/details/85632346 </font></font></p><p><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">版权声明：本文为博主原创文章，转载请附上博文链接！</font></font></p><p><br /></p>', 4, 5, '钟老师', '2019-01-07 16:40:24', '2019-01-07 16:54:10');
INSERT INTO `competition` VALUES (3, '边境test1', 1, '2019-01-21 15:08:54', NULL, '<p>small添加1.</p><p>当前我国没有任何民族资产解冻类的项目，凡是打着类似民族资产解冻旗号让你交钱的，不管钱多钱少，都是诈骗。</p><p><br /></p><p>关于打击“民族资产解冻”类欺诈的公告</p><p>诈骗犯罪活动侵害微信用户的财产权益，破坏平台绿色健康的生态环境，微信对此类违法违规行为一直坚决处理，绝不</p><p><br /></p>', 2, 1, '钟老师', NULL, NULL);
INSERT INTO `competition` VALUES (4, '0313', 1, '2019-03-13 16:20:35', '2019-03-13 16:33:45', '<p>123</p>', 1, 5, '王五', '2019-03-13 16:27:33', '2019-03-13 16:29:33');
INSERT INTO `competition` VALUES (5, '0408ACM', 1, '2019-04-08 20:05:26', '2019-04-08 20:15:53', '<p dir=\"ltr\">this is my first acm project.这是第一个竞赛比赛。2222<br /></p>', 1, 5, '王五', '2019-04-08 20:09:01', '2019-04-08 20:12:50');
INSERT INTO `competition` VALUES (6, '0408ACM第一个', 1, '2019-04-08 20:19:05', NULL, '<p style=\"text-align:left;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">== </font></font><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><span style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">= = = </font></font><font style=\"vertical-align:inherit;\"></font></span></span><font style=\"vertical-align:inherit;\"></font></span></span></span></span><font style=\"vertical-align:inherit;\"></font></span></span><font style=\"vertical-align:inherit;\"></font></span></span></p>', 2, 4, '王五', '2019-06-10 15:48:00', '2019-09-27 09:21:10');
INSERT INTO `competition` VALUES (7, '201904101922', 1, '2019-04-10 19:23:04', '2019-04-10 19:26:47', '<p>dsadsassssdsasdaasa<br /></p>', 2, 5, '王五', '2019-04-10 19:25:28', '2019-04-10 19:26:00');
INSERT INTO `competition` VALUES (8, '201904111451', 2, '2019-04-11 14:52:29', NULL, '<p>dsahdjs,海德汉<br /></p>', 2, 1, '王五', '2019-04-12 14:52:08', '2019-04-19 14:52:15');
INSERT INTO `competition` VALUES (9, '201904111455', 1, '2019-04-11 14:53:52', '2019-04-11 14:59:47', '<p>test201904111455<br /></p>', 2, 5, '王五', '2019-04-11 14:57:19', '2019-04-11 14:59:02');
INSERT INTO `competition` VALUES (10, '测试-bj1', 2, '2019-04-14 23:32:13', NULL, '<h1 style=\"margin-left:0px;\" id=\"ros-for-windows\"><strong><span style=\"color:#222222;\">适用于Windows的ROS</span></strong></h1><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">人们一直对机器人着迷。今天，先进的机器人正在改变我们的生活，无论是在工作还是在家里。仓库机器人已经为在线购物者提供了次日送货服务，许多宠物主人依靠机器人真空吸尘器来保持地板清洁。制造业，运输业，医疗保健业和房地产业等多种行业都从机器人中受益。随着机器人的发展，开发工具也越来越先进。许多开发人员利用<a href=\"http://ros.org/\" rel=\"nofollow\" target=\"_blank\">机器人操作系统（ROS）</a>，这是一套帮助您构建复杂机器人的库和工具。ROS被用于世界各地的许多尖端机器人项目中。</span></p><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">微软很高兴宣布推出适用于Windows的ROS1实验版。这将使Windows 10 IoT Enterprise的可管理性和安全性进入创新的ROS生态系统。</span></p><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">几十年来，Windows一直是机器人和工业系统的可靠部分。借助ROS for Windows，开发人员将能够使用熟悉的Visual Studio工具集以及丰富的AI和云功能。我们期待通过向家庭，教育，商业和工业机器人展示硬件加速Windows机器学习，计算机视觉，Azure认知服务，Azure物联网云服务和其他Microsoft技术等高级功能，为机器人技术带来智能优势。制造商希望让机器人更加了解周围环境，更容易编程，更安全。世界各地的政府，制造商和学术界正在投资下一代制造业，有时也被称为“工业4.0”。</span></p><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">微软正与Open Robotics和ROS Industrial Consortium合作，将机器人操作系统引入Windows。微软已加入ROS工业联盟，其使命是将ROS的先进功能扩展到制造，并提高工业机器人的生产力和投资回报。在西班牙马德里的ROSCon 2018上，微软展示了一台Robotis Turtlebot 3机器人，它运行着名为Melodic Morenia的ROS版本，它识别并引导着最接近机器人的人。该机器人使用新的ROS节点在Intel Coffee Lake NUC上运行Windows 10 IoT Enterprise，该节点利用硬件加速的Windows机器学习。微软还展示了在Azure中运行的ROS仿真环境。它展示了一群在虚拟世界中运行的机器人，这些机器人连接到编排系统并通过Azure IoT Hub进行控制。Microsoft将为ROS1和ROS2提供Windows构建版本，并为Windows提供文档，开发和部署解决方案。</span></p><p style=\"margin-left:0px;\">Windows上的ROS是实验性的。我们的目标是2018年底的核心移植工作。</p><p> </p>', 2, 1, '王五', '2019-04-15 23:30:18', '2019-04-16 18:30:44');
INSERT INTO `competition` VALUES (11, '测试-bj2', 1, '2019-04-14 23:50:43', '2019-04-18 23:49:40', '<h1 id=\"ros-for-windows\" style=\"margin-left:0px;\"><strong><span style=\"color:#222222;\">适用于Windows的ROS</span></strong></h1><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">人们一直对机器人着迷。今天，先进的机器人正在改变我们的生活，无论是在工作还是在家里。仓库机器人已经为在线购物者提供了次日送货服务，许多宠物主人依靠机器人真空吸尘器来保持地板清洁。制造业，运输业，医疗保健业和房地产业等多种行业都从机器人中受益。随着机器人的发展，开发工具也越来越先进。许多开发人员利用<a href=\"http://ros.org/\" target=\"_blank\" rel=\"nofollow\">机器人操作系统（ROS）</a>，这是一套帮助您构建复杂机器人的库和工具。ROS被用于世界各地的许多尖端机器人项目中。</span></p><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">微软很高兴宣布推出适用于Windows的ROS1实验版。这将使Windows 10 IoT Enterprise的可管理性和安全性进入创新的ROS生态系统。</span></p><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">几十年来，Windows一直是机器人和工业系统的可靠部分。借助ROS for Windows，开发人员将能够使用熟悉的Visual Studio工具集以及丰富的AI和云功能。我们期待通过向家庭，教育，商业和工业机器人展示硬件加速Windows机器学习，计算机视觉，Azure认知服务，Azure物联网云服务和其他Micrdfgdsfgosoft技术等高级功能，为机器人技术带来智能优势。制造商希望让机器人更加了解周围环境，更容易编程，更安全。世界各地的政府，制造商和学术界正在投资下一代制造业，有时也被称为“工业4.0”。</span></p><p style=\"margin-left:0px;\"><span style=\"color:#373737;\">微软正与Open Robotics和ROS Industrial Consortium合作，将机器人操作系统引入Windows。微软已加入ROS工业联盟，其使命是将ROS的先进功能扩展到制造，并提高工业机器人的生产力和投资回报。在西班牙马德里的ROSCon 2018上，微软展示了一台Robotis Turtlebot 3机器人，它运行着名为Melodic Morenia的ROS版本，它识别并引导着最接近机器人的人。该机器人使用新的ROS节点在Intel Coffee Lake NUC上运行Windows 10 IoT Enterprise，该节点利用硬件加速的Windows机器学习。微软还展示了在Azure中运行的ROS仿真环境。它展示了一群在虚拟世界中运行的机器人，这些机器人连接到编排系统并通过Azure IoT </span></p><p><br /></p>', 3, 5, '王五', '2019-04-18 23:35:19', '2019-04-18 23:40:47');
INSERT INTO `competition` VALUES (12, 'test', 1, '2019-04-15 21:52:05', '2019-09-18 14:51:04', '<div class=\"article-title\" style=\"font-family:arial;font-size:12px;background-color:#ffffff;\"><h2 style=\"margin:0px;padding:0px;font-size:28px;line-height:40px;font-family:&quot;microsoft yahei&quot;, 微软雅黑, 宋体;\"><span style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">奔驰1.5万金融服务费背后经销商高管揭汽车销售业务</font></font></span></h2></div><div class=\"article-desc clearfix\" style=\"zoom:1;font-family:arial;font-size:12px;background-color:#ffffff;margin-top:15px;\"><div class=\"author-icon\" style=\"float:left;width:32px;height:32px;padding:1px 0px;margin-right:8px;\"><img src=\"https://timg01.bdimg.com/timg?pacompress=&amp;imgtype=0&amp;sec=1439619614&amp;autorotate=1&amp;di=92c4cb1cc1a94e13ae4bc72c78343909&amp;quality=90&amp;size=b200_200&amp;src=http%3A%2F%2Fpic.rmb.bdstatic.com%2Fbecf39b00a5567e4fe3568ddfb6c85f4.jpeg\" style=\"border:0px;width:32px;height:32px;border-radius:50%;\" /></div><div class=\"author-txt\" style=\"float:left;padding:0px;\"><p class=\"author-name\" style=\"padding:0px;font-size:13px;line-height:1.1;color:#3388ff;margin-top:0px;margin-bottom:-6px;\"><span style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">金融界</font></font></span></p><div class=\"article-source article-source-bjh\" style=\"float:left;margin-top:5px;\"><span class=\"date\" style=\"font-size:13px;line-height:2;color:#999999;margin:0px 9px 0px 0px;vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">04-15 &nbsp;</font></font></span><span class=\"time\" style=\"font-size:13px;line-height:2;color:#999999;vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">18:47</font></font></span></div></div></div><div class=\"article-content\" style=\"font-family:arial;font-size:12px;background-color:#ffffff;margin-top:17px;\"><p style=\"padding:0px;font-size:16px;line-height:24px;color:#333333;text-align:justify;margin-top:0px;margin-bottom:0px;\"><span class=\"bjh-p\" style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">近日，网上流传的一段视频显示，一名女车主花费66万元在西安利之星购买了一辆奔驰汽车，在完全有能力全款购车的情况下，利之星的工作人员诱导她办理了分期付款，并收取了高达1.5万元的金融服务费。</font></font></span></p><p style=\"padding:0px;font-size:16px;line-height:24px;color:#333333;text-align:justify;margin-top:22px;margin-bottom:0px;\"><span class=\"bjh-p\" style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">针对1.5万元的金融服务费，有经销商表示其实这就是变相的收钱，一般经销商都会收取5000-15000元不等的金融服务费。除此金融服务费之外，经销商还会收取诸如精品服务，保险返利，牌照办理费，出库费等来变相地增加消费者支出。</font></font></span></p><p style=\"padding:0px;font-size:16px;line-height:24px;color:#333333;text-align:justify;margin-top:22px;margin-bottom:0px;\"><span class=\"bjh-p\" style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\"><font style=\"vertical-align:inherit;\">“站在我们经销商的角度，也不希望加这些费用。”这位经销商称，一方面市场竞争激烈，一方面厂家又有销售指标，卖一辆陪一辆的情况下，迫使汽车经销商们只好通过更低的市场成交价格来吸引消费者购车，再通过其他形式的费用减少亏损。</font></font></span></p><div><span class=\"bjh-p\" style=\"vertical-align:inherit;\"><br /></span></div></div><p><br /></p>', 1, 5, '王五', '2019-04-24 23:42:17', '2019-04-24 23:42:20');
INSERT INTO `competition` VALUES (13, '20190417', 1, '2019-04-17 21:50:30', '2019-04-17 22:41:31', '<p>这是第一场竞赛内容。<br /></p>', 2, 5, '王五', '2019-04-17 22:36:06', '2019-04-17 22:37:38');
INSERT INTO `competition` VALUES (14, '20190421', 1, '2019-04-21 11:13:19', '2019-04-21 12:35:12', '<div class=\"para\" label-module=\"para\">ACM国际大学生程序设计竞赛的历史可以上溯到1970年，当时在美国<a href=\"https://baike.baidu.com/item/%E5%BE%B7%E5%85%8B%E8%90%A8%E6%96%AFA%26M%E5%A4%A7%E5%AD%A6\" target=\"_blank\">德克萨斯A&amp;M大学</a>举办了首届比赛。当时的主办方是the Alpha Chapter of the UPE Computer Science Honor Society。作为一种全新的发现和培养计算机科学顶尖学生的方式，竞赛很快得到美国和加拿大各大学的积极响应。1977年，在ACM计算机科学会议期间举办了首次总决赛，并演变成为一年一届的多国参与的国际性比赛。<div class=\"lemma-picture text-pic layout-right\" style=\"width:200px;float:right;\"><a class=\"image-link\" style=\"width:200px;height:200px;\" href=\"https://baike.baidu.com/pic/ACM%E5%9B%BD%E9%99%85%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AB%9E%E8%B5%9B/3652262/0/246cca2a23050788033bf6e1?fr=lemma&amp;ct=single\" target=\"_blank\" nslog-type=\"9317\"><img style=\"width:200px;height:200px;\" src=\"https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D220/sign=8d290569dab44aed5d4eb9e6831c876a/472309f790529822793f3fe0d7ca7bcb0a46d480.jpg\" /></a></div></div><div class=\"para\" label-module=\"para\">最初几届比赛的参赛队伍主要来自美国和加拿大，后来逐渐发展成为一项世界范围内的竞赛。特别是自1997年IBM开始赞助赛事之后，赛事规模增长迅速。1997年，总共有来自560所大学的840支队伍参加比赛。而到了2004年，这一数字迅速增加到840所大学的4109支队伍并以每年10-20%的速度在增长。</div><p class=\"para\" label-module=\"para\">1980年代，ACM将竞赛的总部设在位于美国<a href=\"https://baike.baidu.com/item/%E5%BE%B7%E5%85%8B%E8%90%A8%E6%96%AF%E5%B7%9E\" target=\"_blank\">德克萨斯州</a>的贝勒大</p><p class=\"para\" label-module=\"para\"><br /></p><p class=\"para\" label-module=\"para\">哈哈哈哈哈哈1</p><p><br /></p>', 1, 5, '王五', '2019-04-21 11:43:11', '2019-04-21 12:34:22');
INSERT INTO `competition` VALUES (15, '20190421222222', 1, '2019-04-21 12:03:14', NULL, '<p>阿斯达阿斯达在！！！！！<br /></p>', 1, 3, '王五', '2019-10-16 16:44:10', '2019-04-22 12:03:10');
INSERT INTO `competition` VALUES (16, 'bjtest2', 3, '2019-05-09 23:34:57', NULL, '<p>美国《联邦公报》于北京时间8日晚上刊登一份公告称，从星期五开始，美国将把2000亿美元中国输美商品的关税从10%提高到25%。</p><p>　　我们注意到，美方的这一公告刊登时间是北京时间8日20点45分，仅两个多小时后的23点23分，中国商务部的谈话就正式发出，指出如果美方关税措施付诸实施，中方将不得不采取必要反制措施。中方的措辞虽然平和，但针锋相对的坚决态度是非常明确的。</p><p>　　美方已经点燃了贸易战进一步升级的导火索。而它的这一冒险行动是在北京已经宣布中方代表团将在9日赴美磋商的情况下做出的。华盛顿在手段匮乏时就搞这种极限发作，它希望会产生震慑效果。华盛顿一定以为中方代表团会急急忙忙赶赴美国解释，抓紧每一分钟扭转局势。但中方代表团反而比原计划推迟一天前往美国。这就是中国人表达意志的方式。</p><p>　　中美星期四将在华盛顿举行的第十一轮“最后谈判”看上去很像是一场“鸿门宴”了。一边是嘶嘶作响燃烧着的导火索，一边与中方继续谈判，</p><p><br /></p>', 1, 1, '王五', '2019-05-10 23:33:53', '2019-05-11 23:33:59');
INSERT INTO `competition` VALUES (17, 'test5.15', 1, '2019-05-15 14:57:16', NULL, '<p>test5.15<br /></p>', 2, 2, '王五', '2019-05-16 14:56:59', '2019-05-24 14:57:05');
INSERT INTO `competition` VALUES (18, '成诺test', 1, '2019-09-23 15:16:14', NULL, '<p>aaaaa</p>', 1, 1, '王五', '2019-09-25 14:42:15', '2019-09-26 14:45:08');
INSERT INTO `competition` VALUES (19, 'ftest111', 1, '2019-10-11 10:26:54', NULL, '<p>111</p>', 4, 1, '王五', '2019-10-10 10:26:30', '2019-10-10 10:26:34');
INSERT INTO `competition` VALUES (20, '111', 2, '2019-10-12 15:10:31', NULL, '<p>111</p>', 1, 1, '王五', '2019-11-29 15:10:13', '2019-10-30 15:10:19');
INSERT INTO `competition` VALUES (21, '10.14', 1, '2019-10-20 10:14:55', NULL, NULL, 6, 4, '王五', '2019-10-20 10:16:36', '2019-10-20 10:16:38');
INSERT INTO `competition` VALUES (22, '10.14.1', 1, '2019-10-20 10:20:14', NULL, NULL, 4, 1, '王五', '2019-10-17 10:20:05', '2019-10-25 10:20:08');
INSERT INTO `competition` VALUES (23, '10.14.2', 1, '2019-10-20 10:32:00', NULL, NULL, 1, 1, '王五', NULL, NULL);
INSERT INTO `competition` VALUES (24, '10.14.3', 1, '2019-10-20 10:33:27', NULL, NULL, 3, 4, '王五', '2019-10-20 11:03:59', '2019-10-20 11:07:48');
INSERT INTO `competition` VALUES (25, '11.11', 1, '2019-11-11 15:05:56', NULL, '<p>ssss</p>', 1, 1, '王五', '2019-10-10 10:26:30', '2019-10-10 10:26:34');

-- ----------------------------
-- Table structure for complist
-- ----------------------------
DROP TABLE IF EXISTS `complist`;
CREATE TABLE `complist`  (
  `CompListId` int(11) NOT NULL AUTO_INCREMENT,
  `Score` int(11) NULL DEFAULT NULL,
  `rank` int(11) NULL DEFAULT NULL,
  `compId` int(11) NULL DEFAULT NULL,
  `teamId` int(11) NULL DEFAULT NULL,
  `teamName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `teamMembersName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tips` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `teamMembersId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`CompListId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of complist
-- ----------------------------
INSERT INTO `complist` VALUES (1, 20, 1, 1, 1, 'wxx', 'wxx', NULL, NULL);
INSERT INTO `complist` VALUES (4, 20, 1, 2, 6, '1.7队', '李四;张三', NULL, NULL);
INSERT INTO `complist` VALUES (7, 40, 1, 4, 4, '张三', '张三', NULL, NULL);
INSERT INTO `complist` VALUES (8, 50, 1, 5, 4, '张三', '张三', '加一分团队分。', NULL);
INSERT INTO `complist` VALUES (9, 40, 2, 5, NULL, 'zh和CW', 'ZH;CW', NULL, NULL);
INSERT INTO `complist` VALUES (10, 25, 1, 7, 10, 'ewqeqwe', '张三', NULL, NULL);
INSERT INTO `complist` VALUES (11, 60, 1, 9, 6, '1.7队', '李四;张三', NULL, NULL);
INSERT INTO `complist` VALUES (12, 30, 1, 13, 11, '第二梯队', '张三;wxx', '+10分', NULL);
INSERT INTO `complist` VALUES (13, 12, 2, 13, NULL, '第一梯队', '不知道', NULL, NULL);
INSERT INTO `complist` VALUES (14, 140, 1, 11, 13, 'test-bj-tm1', '张三;李四', NULL, NULL);
INSERT INTO `complist` VALUES (15, 130, 2, 11, NULL, 'test-bj2- tmp1', 'wer,try,wer', NULL, NULL);
INSERT INTO `complist` VALUES (16, 90, 1, 14, 4, '张三', '张三', NULL, NULL);
INSERT INTO `complist` VALUES (17, 1, 2, 14, NULL, 'cw', 'cw', NULL, NULL);
INSERT INTO `complist` VALUES (19, 50, 1, 6, 20, '20, 20, k\'k\'k\'k', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (20, 0, NULL, 21, 28, 'ssss', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (21, 0, NULL, 21, 29, '5s5', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (22, 0, NULL, 21, 30, 's6', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (23, 30, 1, 24, 29, '5s5', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (24, 0, 2, 24, 28, 'ssss', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (25, 0, NULL, 24, 30, 's6', '杨海东', NULL, NULL);
INSERT INTO `complist` VALUES (26, 0, NULL, 24, 20, '20, 20, k\'k\'k\'k', '杨海东', NULL, NULL);

-- ----------------------------
-- Table structure for compstatus
-- ----------------------------
DROP TABLE IF EXISTS `compstatus`;
CREATE TABLE `compstatus`  (
  `compStateID` int(11) NOT NULL AUTO_INCREMENT,
  `CompStateName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `comments` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`compStateID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '添加补充其他字段' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of compstatus
-- ----------------------------
INSERT INTO `compstatus` VALUES (1, '开始报名', '开始报名');
INSERT INTO `compstatus` VALUES (2, '截至报名', NULL);
INSERT INTO `compstatus` VALUES (3, '开始竞赛', NULL);
INSERT INTO `compstatus` VALUES (4, '提交成果关闭', NULL);
INSERT INTO `compstatus` VALUES (5, '发布成绩', NULL);

-- ----------------------------
-- Table structure for highladder
-- ----------------------------
DROP TABLE IF EXISTS `highladder`;
CREATE TABLE `highladder`  (
  `highLadderId` int(11) NOT NULL AUTO_INCREMENT,
  `highLadderName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `startTime` datetime(0) NULL DEFAULT NULL,
  `endTime` datetime(0) NULL DEFAULT NULL,
  `charge` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `introduction` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`highLadderId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for highladdercomp
-- ----------------------------
DROP TABLE IF EXISTS `highladdercomp`;
CREATE TABLE `highladdercomp`  (
  `highLadderCompId` int(11) NOT NULL AUTO_INCREMENT,
  `highLadderId` int(11) NULL DEFAULT NULL,
  `CompId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`highLadderCompId`) USING BTREE,
  INDEX `FK_Reference_7`(`CompId`) USING BTREE,
  INDEX `FK_Reference_8`(`highLadderId`) USING BTREE,
  CONSTRAINT `FK_Reference_7` FOREIGN KEY (`CompId`) REFERENCES `competition` (`CompId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Reference_8` FOREIGN KEY (`highLadderId`) REFERENCES `highladder` (`highLadderId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for modifyapply
-- ----------------------------
DROP TABLE IF EXISTS `modifyapply`;
CREATE TABLE `modifyapply`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NULL DEFAULT NULL,
  `Applicant` int(11) NULL DEFAULT NULL,
  `passTime` date NULL DEFAULT NULL,
  `passerId` int(11) NULL DEFAULT NULL,
  `ifPass` int(11) NULL DEFAULT NULL,
  `modifyProductId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `modifySpecifications` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `modifyMaterial` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `modifyNumber` int(11) NULL DEFAULT NULL,
  `modify1` int(11) NULL DEFAULT NULL,
  `modify2` int(11) NULL DEFAULT NULL,
  `modify3` int(11) NULL DEFAULT NULL,
  `modify4` int(11) NULL DEFAULT NULL,
  `modify5` int(11) NULL DEFAULT NULL,
  `modify6` int(11) NULL DEFAULT NULL,
  `modify7` int(11) NULL DEFAULT NULL,
  `modifyDate` date NULL DEFAULT NULL,
  `ApplicantName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `productId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of modifyapply
-- ----------------------------
INSERT INTO `modifyapply` VALUES (1, 1, 2, '2019-02-02', NULL, 0, '1', NULL, NULL, NULL, NULL, NULL, 111, NULL, NULL, NULL, NULL, '2019-02-02', 'shaoke', 'AH01');
INSERT INTO `modifyapply` VALUES (2, 4, 2, '2019-02-03', NULL, 1, '4', NULL, NULL, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-02-03', 'shaoke', 'AK48');
INSERT INTO `modifyapply` VALUES (3, 7, 2, '2019-02-03', NULL, 0, NULL, '11', 'Cu', 11, 44, 55, NULL, 11, 22, 33, NULL, NULL, 'shaoke', '98K2');

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question`  (
  `questionId` int(11) NOT NULL AUTO_INCREMENT,
  `questionName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `questionIntro` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `questionNum` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `CompId` int(11) NULL DEFAULT NULL,
  `fileDesc` varchar(9000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `questionAnsw` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fileName` varchar(2048) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`questionId`) USING BTREE,
  INDEX `FK_Reference_14`(`CompId`) USING BTREE,
  CONSTRAINT `FK_Reference_14` FOREIGN KEY (`CompId`) REFERENCES `competition` (`CompId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question
-- ----------------------------
INSERT INTO `question` VALUES (1, '1206第一题', '<p>这是1206的第一题</p>', '1', 1, '5cb50f11-ddf9-47a8-96f5-a8325a75fd94.txt;', '<p>这是1206的第一题答案</p>', '123.txt;');
INSERT INTO `question` VALUES (2, '0107第一', '<p>123123123123</p>', '1', 2, 'f08af790-4203-49d3-961c-8e0c2f91904e.jar;fb3f060a-1e62-43d3-9706-e42ea9bb0a29.txt;', '<p>444444444444444444444444444444444</p>', 'mysql-connector-java-5.1.7-bin.jar;spring.txt;');
INSERT INTO `question` VALUES (3, '0107第二', '<p>切切切切切切群</p>', '2', 2, '54475b35-dbd3-41c8-8387-2bfcb199d24b.txt;', '<p>2222222222222222</p>', '笔记.txt;');
INSERT INTO `question` VALUES (4, 'ACM1的第一题', '<p>123</p>', '1', 4, '33890037-f7a1-4d13-8890-2fe75c1d98fc.html;', '<p>123</p>', 'index.html;');
INSERT INTO `question` VALUES (5, 'wqeqwe', '<p>12qwe</p>', '2', 4, NULL, '<p>sdad</p>', NULL);
INSERT INTO `question` VALUES (6, '0408第一题', '<p>这个是题目描述。</p>', '1', 5, 'cd33fb93-bd1b-468d-8ce8-80b60242c1dd.html;fd3fb6d0-af3c-431e-b131-3df5df5e1681.txt;', '<p>这个是题目答案。</p>', 'index.html;闪讯.txt;');
INSERT INTO `question` VALUES (7, '0408第二题', '<p>123123123123123</p>', '2', 5, '2785b8f0-285e-4b58-8b2d-68e102a12725.txt;', '<p>123123123请问请问群无</p>', '操作流程.txt;');
INSERT INTO `question` VALUES (8, 'dsadsa', '<p>sdadsssss<br /></p>', '1', 7, 'c661a914-069c-4f3b-b5b9-c0c59383a2d4.txt;', '<p>sdsdsdsda<br /></p>', '阿里云.txt;');
INSERT INTO `question` VALUES (9, 'test1', '<p>test1intro<br /></p>', '1', 9, '0275754f-4091-451e-b44e-0111134c9443.txt;599675d8-7fab-46bb-9aca-aaa90709643c.txt;', '<p>test1ans<br /></p>', '新建文本文档 (2).txt;新建文本文档.txt;');
INSERT INTO `question` VALUES (11, '请问请问群翁群翁', '<p>阿斯顿阿斯顿阿斯顿阿斯顿<br /></p>', '1', 13, '78e0d3ff-cc89-4bd8-b260-73091f41ee87.txt;', '<p>自行车自行车自行车自行车<br /></p>', 't1est.txt;');
INSERT INTO `question` VALUES (12, '测试空文件', '', '2', 13, '22baf272-6f8e-4d34-abf6-d3c4d4a833e9.txt;', '', '123.txt;');
INSERT INTO `question` VALUES (16, '测试空文件2', '<p>真是的按错<br /></p>', '4', 13, 'fe30d9be-132d-4572-bc94-5d452db60d36.doc;', '<p>阿斯蒂芬按时<br /></p>', '123.doc;');
INSERT INTO `question` VALUES (18, '测试空文件3', '<p>十大十大</p>', '4', 13, '625ad770-11d1-4dd6-a48d-0e5b2409bb87.txt;', '<p>12额23412阿萨德</p>', 't1est.txt;');
INSERT INTO `question` VALUES (19, 't1', '<p>etgfdgergfdgdsfgregresg<br /></p>', '1', 11, '3ec52f10-259b-42b6-b745-b139520aad47.png;', '<p>dsrgdfgregregdrgreg<br /></p>', '机器人.png;');
INSERT INTO `question` VALUES (20, 't2', '<p>fdsfggrdgersgesr<br /></p>', '2', 11, 'd0c401f9-954b-4ba4-8f4b-766d765b57ff.docx;', '<p>dsfgergdsfgersgesr<br /></p>', '勿忘国耻  振兴中华.docx;');
INSERT INTO `question` VALUES (22, '222', '<p>撒大声地阿萨德<br /></p>', '1', 14, 'ec7764de-2951-4d88-8f21-e072d7419ea3.txt;479e41e4-a9b4-4aeb-8c93-d59f326464af.txt;', '<p>水电费水电费司法染发的额发F<br /></p>', '链接地址.txt;尚硅谷hadoop离线全套.txt;');
INSERT INTO `question` VALUES (23, '0421第1题', '<p>ass 长得丑！！！生产者 八方 第三方这些 层 <br /></p>', '1', 15, '5e6c56bb-a2ff-4f16-adb0-79c7064d458f.txt;7580652d-675f-4c59-ae9d-2b82263ed8d6.txt;', '<p>第三方 安抚司法刷副本是大法官啊都是高清3个人阿萨德而我国为四个人一哈头顶上的陈冠希我挺喜欢5 <br /></p>', '思特奇面试.txt;尚硅谷hadoop离线全套.txt;');
INSERT INTO `question` VALUES (24, '0421第2题111', '<p>阿达大师傅在自行车打<br /></p>', '2', 15, ' 4aff0dfa-9899-4309-8b44-ef3979a0d048.txt; a877063a-b95b-4dd1-a3de-b92571563f47.txt;26d40e52-b045-4317-9c19-7fcf1fd76158.txt;', '<p>阿达阿达是的 &nbsp;<br /></p>', '汽车之家.txt;汽车之家笔记.txt;尚硅谷hadoop离线全套.txt;');
INSERT INTO `question` VALUES (25, '0421第2题', '<p>大师傅DDSFZDS VC ZC <br /></p>', '3', 15, '716e979c-cafa-4845-b137-7ec5bead38f9.txt;cb052bf1-4527-4860-92d3-1bc7a9225612.txt;', '<p>ZV Z ASD FA电话电饭锅多个 过程<br /></p>', '汽车之家.txt;汽车之家笔记.txt;');
INSERT INTO `question` VALUES (26, '0421第4题', '<p>阿斯达是的阿萨德<br /></p>', '4', 15, 'f37d5d83-02c1-4efb-a26b-975dcd2e37c5.pptx;a7bc6085-9bda-40a6-9dba-53959978b849.txt;', '<p>x层直线轴承分安慰是的自助餐<br /></p>', '汽车口碑信息大数据项目的介绍.pptx;思特奇面试.txt;');
INSERT INTO `question` VALUES (27, 'qtest5.15', '<p>test5.15<br /></p>', '1', 17, ' 8c9ad1a4-29ed-4b68-85db-e598e9e26d87.txt;d794fbf1-5011-40fd-99b3-d53f3a2c5268.txt;', '<p>test5.15<br /></p>', '新建文本文档.txt;新建文本文档.txt;');
INSERT INTO `question` VALUES (28, '', '<p>wdwadasd</p>', '1', 6, NULL, '<p>qweqwe</p>', NULL);
INSERT INTO `question` VALUES (29, '', '', '1', 18, 'ebe1f29a-00ae-4eae-be62-0186ddd29d86.doc;', '', 'exp2_simple+query1.doc;');
INSERT INTO `question` VALUES (30, '111', '<p>11</p>', '2', 18, '39c372a3-d5bb-4220-a914-eddecf3d19bd.doc;6da3e2e4-2ce6-47b7-aba1-654e8bc0ddbf.sql;', '<p>11</p>', 'exp2_simple+query1.doc;my_first_database_data.sql;');
INSERT INTO `question` VALUES (31, '121', '<p>111</p>', '1', 19, ' 70d431d6-1c64-432f-8c9d-7ec25542c5f2.doc; c7b3fc4d-9c63-4195-95b2-fc5d050d000f.doc;696c8478-2d2e-4bb9-a948-f2851c1de682.doc;', '<p>111</p>', 'exp3-.doc;exp3-.doc;exp3-.doc;');
INSERT INTO `question` VALUES (32, '123', '<p>123123</p>', '1', 24, '2a948220-98e7-4d45-ad6c-7ebee21139cf.c;', '<p>123</p>', 'exit_test1.c;');

-- ----------------------------
-- Table structure for stu_team
-- ----------------------------
DROP TABLE IF EXISTS `stu_team`;
CREATE TABLE `stu_team`  (
  `stuteamid` int(11) NOT NULL AUTO_INCREMENT,
  `stuId` int(11) NULL DEFAULT NULL,
  `teamId` int(11) NULL DEFAULT NULL,
  `leader` tinyint(1) NULL DEFAULT NULL,
  `IsPass` int(11) NULL DEFAULT NULL,
  `Role` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`stuteamid`) USING BTREE,
  INDEX `FK_Reference_1`(`stuId`) USING BTREE,
  INDEX `FK_Reference_3`(`teamId`) USING BTREE,
  CONSTRAINT `FK_Reference_1` FOREIGN KEY (`stuId`) REFERENCES `student` (`stuId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Reference_3` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stu_team
-- ----------------------------
INSERT INTO `stu_team` VALUES (1, 1, 1, 1, 1, '个人');
INSERT INTO `stu_team` VALUES (2, 2, 2, 1, 1, '个人');
INSERT INTO `stu_team` VALUES (3, 3, 3, 1, 1, '个人');
INSERT INTO `stu_team` VALUES (4, 4, 4, 1, 1, '个人');
INSERT INTO `stu_team` VALUES (5, 5, 5, 1, 1, '个人');
INSERT INTO `stu_team` VALUES (6, 5, 6, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (7, 4, 6, 0, 1, '队员');
INSERT INTO `stu_team` VALUES (8, NULL, 7, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (9, NULL, 8, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (10, NULL, 9, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (11, 4, 10, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (12, 4, 11, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (13, 4, 12, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (14, 5, 12, 0, 0, '队员');
INSERT INTO `stu_team` VALUES (15, 1, 11, 0, 1, '队员');
INSERT INTO `stu_team` VALUES (16, 4, 13, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (17, 5, 13, 0, 1, '队员');
INSERT INTO `stu_team` VALUES (18, NULL, 14, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (19, 4, 15, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (20, 3, 6, 0, 0, '队员');
INSERT INTO `stu_team` VALUES (21, NULL, 16, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (22, NULL, 17, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (23, NULL, 18, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (24, NULL, 19, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (25, 3, 20, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (26, NULL, 21, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (27, 3, 15, 0, 1, '队员');
INSERT INTO `stu_team` VALUES (28, NULL, 22, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (29, NULL, 23, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (30, NULL, 24, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (31, 3, 25, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (32, 3, 26, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (33, 3, 27, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (34, 3, 28, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (35, 3, 29, 1, 1, '队长');
INSERT INTO `stu_team` VALUES (36, 3, 30, 1, 1, '队长');

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `stuId` int(11) NOT NULL AUTO_INCREMENT,
  `stuNum` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `stuName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `class` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phoneNum` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `QQ` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `compNum` int(11) NULL DEFAULT NULL,
  `passwordQue` int(11) NULL DEFAULT NULL,
  `answer` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`stuId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '学生信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES (1, '2015329620027', 'wxx', '123456', '15计算机一班', '14667542361', '123456789', '123456789@qq.com', 1, 3, 'qqq');
INSERT INTO `student` VALUES (2, '200001', '张欣', '123', '16计科2班', '13111111111', '111111', '123@123.com', 1, 1, '111');
INSERT INTO `student` VALUES (3, '2016329600163', '杨海东', '123123', '大搜集的', '1234556', '21324536', '261378164@qq.com', 2, 1, 'dasoi');
INSERT INTO `student` VALUES (4, '201801', '张三', '123', 'cs1', '1585555555', '66666', '6666@qq.com', 2, 1, '李六');
INSERT INTO `student` VALUES (5, '201802', '李四', '123', 'cs1', '15822222222', '66666', '6666@qq.com', 1, 1, '李六');

-- ----------------------------
-- Table structure for supplier_code_table
-- ----------------------------
DROP TABLE IF EXISTS `supplier_code_table`;
CREATE TABLE `supplier_code_table`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `SupplierName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of supplier_code_table
-- ----------------------------
INSERT INTO `supplier_code_table` VALUES (1, '刘厂');
INSERT INTO `supplier_code_table` VALUES (2, '张厂');
INSERT INTO `supplier_code_table` VALUES (3, '叶厂');
INSERT INTO `supplier_code_table` VALUES (4, '竺厂');
INSERT INTO `supplier_code_table` VALUES (5, '董厂');
INSERT INTO `supplier_code_table` VALUES (6, '备用1');
INSERT INTO `supplier_code_table` VALUES (7, '备用2');

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `teaId` int(11) NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `CompTypeid` int(11) NULL DEFAULT NULL,
  `phoneNum` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `teaName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`teaId`) USING BTREE,
  INDEX `FK_Reference_13`(`CompTypeid`) USING BTREE,
  CONSTRAINT `FK_Reference_13` FOREIGN KEY (`CompTypeid`) REFERENCES `compcode` (`CompTypeid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '教师信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES (123, '123', 1, '13652541222', '王五');

-- ----------------------------
-- Table structure for team
-- ----------------------------
DROP TABLE IF EXISTS `team`;
CREATE TABLE `team`  (
  `teamId` int(11) NOT NULL AUTO_INCREMENT,
  `teamName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `teamLeader` int(11) NULL DEFAULT NULL,
  `teamIntro` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`teamId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '团队表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of team
-- ----------------------------
INSERT INTO `team` VALUES (1, 'wxx', 1, '个人');
INSERT INTO `team` VALUES (2, '张欣', 2, '个人');
INSERT INTO `team` VALUES (3, '杨海东', 3, '个人');
INSERT INTO `team` VALUES (4, '张三', 4, '个人');
INSERT INTO `team` VALUES (5, '李四', 5, '个人');
INSERT INTO `team` VALUES (6, '1.7队', 5, '1积极2');
INSERT INTO `team` VALUES (7, 'myteam', NULL, 'wu');
INSERT INTO `team` VALUES (8, '杨杨杨', NULL, 'NB');
INSERT INTO `team` VALUES (9, 'assa', NULL, 'asdasda');
INSERT INTO `team` VALUES (10, 'ewqeqwe', 4, 'ewewew');
INSERT INTO `team` VALUES (11, '第二梯队', 4, 'dsdsdsdsd');
INSERT INTO `team` VALUES (12, 'awals', 4, 'dsdsds');
INSERT INTO `team` VALUES (13, 'test-bj-tm1', 4, 'test-bj-tm1test-bj-tm1test-bj-tm1');
INSERT INTO `team` VALUES (14, 'myteam2', NULL, 'aaaa');
INSERT INTO `team` VALUES (15, '5.15test', 4, '5.15test');
INSERT INTO `team` VALUES (16, 'aaaaaaaaa', NULL, 'aa');
INSERT INTO `team` VALUES (17, '123445', NULL, '打分分数');
INSERT INTO `team` VALUES (18, 'ddsdsd', NULL, 'sddsd');
INSERT INTO `team` VALUES (19, 'zz', NULL, 'zz');
INSERT INTO `team` VALUES (20, '20, 20, 20, k\'k\'k\'k', 3, '酷酷');
INSERT INTO `team` VALUES (21, 'wwww', NULL, '');
INSERT INTO `team` VALUES (22, '88', NULL, 'ss');
INSERT INTO `team` VALUES (23, 'helloword', NULL, 'sss');
INSERT INTO `team` VALUES (24, 'sss', NULL, 'sss');
INSERT INTO `team` VALUES (25, '5555', 3, '5555');
INSERT INTO `team` VALUES (26, 'sdaasda', 3, 'ssss');
INSERT INTO `team` VALUES (27, 'cao', 3, 'ccc');
INSERT INTO `team` VALUES (28, 'ssss', 3, 'ssss');
INSERT INTO `team` VALUES (29, '5s5', 3, '');
INSERT INTO `team` VALUES (30, 's6', 3, '');

-- ----------------------------
-- Table structure for teamcompetion
-- ----------------------------
DROP TABLE IF EXISTS `teamcompetion`;
CREATE TABLE `teamcompetion`  (
  `teamCompId` int(11) NOT NULL AUTO_INCREMENT,
  `teamId` int(11) NULL DEFAULT NULL,
  `CompId` int(11) NULL DEFAULT NULL,
  `submitTime` datetime(0) NULL DEFAULT NULL,
  `IsPass` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`teamCompId`) USING BTREE,
  INDEX `FK_Reference_4`(`CompId`) USING BTREE,
  INDEX `FK_Reference_5`(`teamId`) USING BTREE,
  CONSTRAINT `FK_Reference_4` FOREIGN KEY (`CompId`) REFERENCES `competition` (`CompId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Reference_5` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '学生参见竞赛信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teamcompetion
-- ----------------------------
INSERT INTO `teamcompetion` VALUES (1, 1, 1, '2018-12-06 21:57:02', 1);
INSERT INTO `teamcompetion` VALUES (2, 6, 2, '2019-01-07 16:43:01', 1);
INSERT INTO `teamcompetion` VALUES (3, 4, 4, '2019-03-13 16:27:55', 1);
INSERT INTO `teamcompetion` VALUES (4, 4, 5, '2019-04-08 20:12:38', 1);
INSERT INTO `teamcompetion` VALUES (5, 10, 7, '2019-04-10 19:25:47', 1);
INSERT INTO `teamcompetion` VALUES (6, 6, 9, '2019-04-11 14:58:15', 1);
INSERT INTO `teamcompetion` VALUES (7, 11, 13, '2019-04-17 22:37:03', 1);
INSERT INTO `teamcompetion` VALUES (8, 13, 11, '2019-04-18 23:39:40', 1);
INSERT INTO `teamcompetion` VALUES (9, 4, 14, '2019-04-21 12:31:12', 1);
INSERT INTO `teamcompetion` VALUES (10, 2, 16, NULL, 0);
INSERT INTO `teamcompetion` VALUES (11, 10, 6, NULL, 2);
INSERT INTO `teamcompetion` VALUES (12, 13, 17, NULL, 2);
INSERT INTO `teamcompetion` VALUES (13, 3, 15, NULL, 1);
INSERT INTO `teamcompetion` VALUES (14, 3, 16, NULL, 0);
INSERT INTO `teamcompetion` VALUES (15, 20, 6, '2019-09-04 20:41:02', 1);
INSERT INTO `teamcompetion` VALUES (16, 10, 8, NULL, 0);
INSERT INTO `teamcompetion` VALUES (17, 20, 8, NULL, 0);
INSERT INTO `teamcompetion` VALUES (18, 25, 8, NULL, 0);
INSERT INTO `teamcompetion` VALUES (19, 26, 8, NULL, 0);
INSERT INTO `teamcompetion` VALUES (20, 27, 8, NULL, 0);
INSERT INTO `teamcompetion` VALUES (21, 3, 20, NULL, 0);
INSERT INTO `teamcompetion` VALUES (22, 28, 21, NULL, 2);
INSERT INTO `teamcompetion` VALUES (23, 29, 21, NULL, 2);
INSERT INTO `teamcompetion` VALUES (24, 30, 21, NULL, 2);
INSERT INTO `teamcompetion` VALUES (25, 29, 22, NULL, 0);
INSERT INTO `teamcompetion` VALUES (26, 29, 19, NULL, 0);
INSERT INTO `teamcompetion` VALUES (27, 3, 23, NULL, 0);
INSERT INTO `teamcompetion` VALUES (28, 29, 24, '2019-10-20 11:06:51', 1);
INSERT INTO `teamcompetion` VALUES (29, 28, 24, NULL, 1);
INSERT INTO `teamcompetion` VALUES (30, 30, 24, NULL, 1);
INSERT INTO `teamcompetion` VALUES (31, 20, 24, NULL, 1);
INSERT INTO `teamcompetion` VALUES (32, 28, 22, NULL, 0);

-- ----------------------------
-- Table structure for works
-- ----------------------------
DROP TABLE IF EXISTS `works`;
CREATE TABLE `works`  (
  `workId` int(11) NOT NULL AUTO_INCREMENT,
  `teamCompId` int(11) NULL DEFAULT NULL,
  `workName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `introduction` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `submitId` int(11) NULL DEFAULT NULL,
  `question` int(11) NULL DEFAULT NULL,
  `filePath` varchar(9000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Score` int(11) NULL DEFAULT NULL,
  `submitTime` datetime(0) NULL DEFAULT NULL,
  `fileName` varchar(2048) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`workId`) USING BTREE,
  INDEX `teamcompId_worksAndteamCompfk`(`teamCompId`) USING BTREE,
  CONSTRAINT `teamcompId_worksAndteamCompfk` FOREIGN KEY (`teamCompId`) REFERENCES `teamcompetion` (`teamCompId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of works
-- ----------------------------
INSERT INTO `works` VALUES (1, 1, 'wxx的', '这是wxx的1206第一次上交题目作品。', 1, 1, '8c65304c-ad0b-4cf0-bae6-61f7910bf4d0.txt;', 20, '2018-12-06 21:57:02', '123.txt;');
INSERT INTO `works` VALUES (2, 2, 'sda', '大萨达所', 5, 2, '7df8bc88-5c47-4f08-b34f-051661b96e44.jpg;e3d1db65-e636-4d3a-bf14-0c7f7ebba7c2.jpg;', 20, '2019-01-07 16:43:01', '126802254401.jpg;BKBKkAblgBwtjnD.jpg;');
INSERT INTO `works` VALUES (3, 3, 'sda', 'rrrrr', 4, 4, '', 40, '2019-03-13 16:27:54', '');
INSERT INTO `works` VALUES (4, 4, 'sda', 'sdsdsdsdsad', 4, 6, 'dfb1b64f-87bc-4d49-8329-61bffb2eb468.txt;0cc431bb-73db-4c73-8cb0-67b89f84458c.txt;', 20, '2019-04-08 20:11:11', '新建文本文档 (2).txt;新建文本文档 (2).txt;');
INSERT INTO `works` VALUES (5, 4, 'sda', 'dsdsdadsadsada', 4, 7, 'f85b9976-0f1a-493e-ad87-3365b49d4471.txt;', 29, '2019-04-08 20:12:38', '新建文本文档.txt;');
INSERT INTO `works` VALUES (6, 5, 'dsdsa', 'dsdsdas', 4, 8, '35a593a7-f55b-46dd-9d1b-b399024c05f1.txt;', 25, '2019-04-10 19:25:47', '新建文本文档 (3).txt;');
INSERT INTO `works` VALUES (7, 6, 'tset1ans', 'test1pass11121', 5, 9, '1a92c643-2936-4f08-a56f-4ac928da3390.txt;b7b88340-3ea8-4e6b-ae6d-b174e669d900.txt;', NULL, '2019-04-11 14:58:15', '新建文本文档.txt;新建文本文档 (2).txt;');
INSERT INTO `works` VALUES (8, 7, '1232231', 'jsfjakshfhsfjafhsajkfhasf', 4, 11, '9dd0534a-5a85-4724-877e-7905f94ddcc7.txt;b3416582-b3e7-4fbd-ac96-371b9ea20b2e.txt;', 20, '2019-04-17 22:37:03', '新建文本文档 (3).txt;新建文本文档.txt;');
INSERT INTO `works` VALUES (9, 8, 'sdfsadf', 'fewdsfsadf', 4, 19, '0df7cc86-02fa-40a5-a4b0-9e875dc07794.txt;', 44, '2019-04-18 23:38:53', 'studi.txt;');
INSERT INTO `works` VALUES (10, 8, 'sfdgretreg', 'dfgsergdfger', 4, 20, '584e0555-ca03-42bc-8378-98b5ab8dac23.doc;', 66, '2019-04-18 23:39:40', '电子发票报销校验流程.doc;');
INSERT INTO `works` VALUES (11, 9, 'dfsfdsfdsfds', 'dsfdsfsdfdsfdsdfsfds', 4, 22, '9bf13867-944d-4430-95e7-32c161b80e58.txt;fa5d5408-6378-4989-abf5-094c9ba5c2ce.txt;', 90, '2019-04-21 12:31:12', '新建文本文档 (2).txt;新建文本文档.txt;');
INSERT INTO `works` VALUES (12, 15, '', '', 3, 28, '22b91f3f-a851-4537-aab6-e5570e0bc0cc.py;', 20, '2019-09-04 20:41:02', '1.py;');
INSERT INTO `works` VALUES (13, 28, '4', '4', 3, 32, '1c90d09e-74c9-4165-bb1f-4cba509b0f66.c;', 30, '2019-10-20 11:06:51', 'hello.c;');

-- ----------------------------
-- View structure for userinfo
-- ----------------------------
DROP VIEW IF EXISTS `userinfo`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `userinfo` AS select `student`.`stuNum` AS `num`,`student`.`password` AS `password`,(select 1) AS `type` from `student` union select `teacher`.`teaId` AS `num`,`teacher`.`password` AS `password`,(select 2) AS `type` from `teacher`;

-- ----------------------------
-- Procedure structure for deleteComp
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteComp`;
delimiter ;;
CREATE PROCEDURE `deleteComp`(IN cid int)
BEGIN
		START TRANSACTION;
			/* 删除排行榜 */
			DELETE FROM complist WHERE CompId=cid;
			/* 删除竞赛团队上交的作品 */
			DELETE FROM works WHERE teamCompId 
			IN (SELECT teamCompId FROM teamcompetion WHERE CompId=cid);
			/* 删除竞赛的题目信息 */
			DELETE FROM question where CompId=cid;
			/* 删除参加竞赛的团队信息 */
			DELETE FROM teamcompetion WHERE CompId=cid;
			/* 删除竞赛 */
			DELETE FROM competition WHERE CompId = cid;
		COMMIT;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for deleteUser
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteUser`;
delimiter ;;
CREATE PROCEDURE `deleteUser`(IN id varchar(255),
	IN t int)
BEGIN
		IF (t=1) THEN 
			START TRANSACTION;
			/* 删除该学生以个人参加竞赛的团队 */
			DELETE FROM complist WHERE teamId 
			IN (SELECT teamId  FROM stu_team 
					WHERE stuId = id AND Role='个人');
			/* 删除个人团队介绍 */
			DELETE FROM team WHERE teamId
				IN (SELECT teamId  FROM stu_team 
					WHERE stuId = id AND teamIntro='个人');
			/* 删除学生所在团队的信息 */
			DELETE FROM stu_team WHERE stuId 
			IN (SELECT stuId FROM student WHERE  stuNum = id);
			/* 删除该学生的信息 */
			DELETE FROM student WHERE stuNum = id;
			COMMIT;
		ELSE
			/* 删除老师的信息 */
			DELETE FROM teacher WHERE teaId = id;
		END IF;
 END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for initializePassword
-- ----------------------------
DROP PROCEDURE IF EXISTS `initializePassword`;
delimiter ;;
CREATE PROCEDURE `initializePassword`(IN id varchar(255),
		IN t int)
BEGIN
		IF (t=1) THEN 
			UPDATE student set `password`='123456' WHERE stuNum = id;
		ELSE
			UPDATE teacher set `password`='123456' WHERE teaId = id;

		END IF;
 END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
