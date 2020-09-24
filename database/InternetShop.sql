-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: internetshop
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `coments`
--

DROP TABLE IF EXISTS `coments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coments` (
  `ComentID` int NOT NULL,
  `Stars` bit(1) NOT NULL,
  `BadPart` varchar(200) DEFAULT NULL,
  `GoodPart` varchar(200) DEFAULT NULL,
  `UserLeftID` int NOT NULL,
  `ProductId` int NOT NULL,
  PRIMARY KEY (`ComentID`),
  KEY `ComentBy_idx` (`UserLeftID`),
  KEY `prodRef_idx` (`ProductId`),
  CONSTRAINT `ComentBy` FOREIGN KEY (`UserLeftID`) REFERENCES `users` (`UserId`),
  CONSTRAINT `prodRef` FOREIGN KEY (`ProductId`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coments`
--

LOCK TABLES `coments` WRITE;
/*!40000 ALTER TABLE `coments` DISABLE KEYS */;
/*!40000 ALTER TABLE `coments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `decoretypes`
--

DROP TABLE IF EXISTS `decoretypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `decoretypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `decoreType` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `decoretypes`
--

LOCK TABLES `decoretypes` WRITE;
/*!40000 ALTER TABLE `decoretypes` DISABLE KEYS */;
INSERT INTO `decoretypes` VALUES (1,'Kariert'),(2,'Plain'),(3,'Geometric'),(4,'Flower print'),(5,'Ornaments'),(6,'Pictures print'),(7,'Plant prints');
/*!40000 ALTER TABLE `decoretypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturs`
--

DROP TABLE IF EXISTS `manufacturs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturs`
--

LOCK TABLES `manufacturs` WRITE;
/*!40000 ALTER TABLE `manufacturs` DISABLE KEYS */;
INSERT INTO `manufacturs` VALUES (1,'IKEA'),(2,'PUFFETO'),(3,'AMERS'),(4,'AMF'),(5,'VIVA');
/*!40000 ALTER TABLE `manufacturs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Material` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'Cotton'),(2,'Artificial Leather'),(3,'None'),(4,'Eco-leather'),(5,'Leather'),(6,'Flock'),(7,'Textile');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderId` int NOT NULL,
  `TotalAmount` decimal(15,2) NOT NULL,
  `DeliveryAdressId` int NOT NULL,
  PRIMARY KEY (`OrderId`),
  KEY `DeliveryId_idx` (`DeliveryAdressId`),
  CONSTRAINT `DeliveryId` FOREIGN KEY (`DeliveryAdressId`) REFERENCES `usersdeliveryadress` (`AdressId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordersitems`
--

DROP TABLE IF EXISTS `ordersitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordersitems` (
  `ItemsId` int NOT NULL,
  `ProductId` int NOT NULL,
  `OrderId` int NOT NULL,
  PRIMARY KEY (`ItemsId`),
  KEY `OrderId_idx` (`OrderId`),
  KEY `ProdId_idx` (`ProductId`),
  CONSTRAINT `OrderId` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`OrderId`),
  CONSTRAINT `ProdId` FOREIGN KEY (`ProductId`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordersitems`
--

LOCK TABLES `ordersitems` WRITE;
/*!40000 ALTER TABLE `ordersitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordersitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Price` decimal(15,2) NOT NULL,
  `StorageAmount` int NOT NULL,
  `Description` text,
  `PhotoPath` varchar(50) NOT NULL DEFAULT './img/nophoto.jpg',
  `SellerID` int NOT NULL,
  `BoughtAmount` int NOT NULL DEFAULT '0',
  `AvarageStar` tinyint DEFAULT NULL,
  `manufactur` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `decoreType` int DEFAULT NULL,
  `TransformMecanism` int DEFAULT NULL,
  `Material` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `Color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `SellerId_idx` (`SellerID`),
  KEY `manufactur-id_idx` (`manufactur`),
  KEY `trans-mech-id_idx` (`TransformMecanism`),
  KEY `decore-type-id_idx` (`decoreType`),
  KEY `material-id_idx` (`Material`),
  KEY `type-id_idx` (`type`),
  CONSTRAINT `decore-type-id` FOREIGN KEY (`decoreType`) REFERENCES `decoretypes` (`id`),
  CONSTRAINT `manufactur-id` FOREIGN KEY (`manufactur`) REFERENCES `manufacturs` (`id`),
  CONSTRAINT `material-id` FOREIGN KEY (`Material`) REFERENCES `materials` (`id`),
  CONSTRAINT `SellerId` FOREIGN KEY (`SellerID`) REFERENCES `users` (`UserId`),
  CONSTRAINT `trans-mech-id` FOREIGN KEY (`TransformMecanism`) REFERENCES `transformmecanism` (`id`),
  CONSTRAINT `type-id` FOREIGN KEY (`type`) REFERENCES `types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Диван кутовий Kairos Кварк Берлін',299.00,5,'Топ за свои деньги','./img/nophoto.jpg',19,1,4,1,6,3,6,2,300,'yellow'),(3,'Диван Ещё Один',200.00,10,NULL,'./img/nophoto.jpg',19,3,2,NULL,2,1,4,3,300,NULL),(4,'Диван Ещё Второй',256.23,2,NULL,'./img/nophoto.jpg',19,0,3,3,2,4,2,NULL,NULL,'grey');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transformmecanism`
--

DROP TABLE IF EXISTS `transformmecanism`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transformmecanism` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Mechanism` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transformmecanism`
--

LOCK TABLES `transformmecanism` WRITE;
/*!40000 ALTER TABLE `transformmecanism` DISABLE KEYS */;
INSERT INTO `transformmecanism` VALUES (1,'Sofa'),(2,'Dolphin'),(3,'Scissors'),(4,'Puma'),(5,'Tahta'),(6,'Book'),(7,'Fortune');
/*!40000 ALTER TABLE `transformmecanism` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES (1,'Ofice'),(2,'Module'),(3,'Stray'),(4,'Child'),(5,'Complect'),(6,'Angled');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(64) NOT NULL,
  `UserFIO` varchar(45) NOT NULL,
  `Organization` varchar(50) DEFAULT NULL,
  `Login` varchar(30) NOT NULL,
  `Pass` varchar(20) NOT NULL,
  `Phone` varchar(15) NOT NULL,
  `AvarageRate` bit(6) NOT NULL DEFAULT b'0',
  `Authorized` tinyint NOT NULL DEFAULT '0',
  `Role` varchar(10) NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Login_UNIQUE` (`Login`),
  UNIQUE KEY `Phone_UNIQUE` (`Phone`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kolyana31@gmail.com','Nickolay Rushecnko','null','admin','Qcezadwx311','+380506082229',_binary '\0',1,'admin'),(17,'kolyana31@gmail.com','Николай Рущенко','SlaveWorld Incorporation','kolyana31','Qcezadwx311','+380668312754',_binary '\0',0,'user'),(19,'minesruft31@gmail.com','Николай Рущенко','SlaveWorld Incorporation','kolyana23','Qeadzcwx311','89708872308',_binary '\0',0,'seller'),(20,'1212ana31@gmail.com','Николай Рущенко','','kolyana3112121','qzwxecaASD1','0501983267',_binary '\0',0,'user'),(23,'kolyana31@gmail.com','Mykola Rushchenko','asdasdasfasdasd','kolyana312323','Qcezadwx311','2122891874',_binary '\0',0,'seller'),(27,'1212sruft31@gmail.com','Николай Рущенко','','sfsaljfasjfh','Qcezadwx311','+380668312759',_binary '\0',0,'user'),(29,'stalinCool@gmail.com','USSR Gucci Boy','','Stalin1991','Qcezadwx311','+380668312712',_binary '\0',0,'user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersdeliveryadress`
--

DROP TABLE IF EXISTS `usersdeliveryadress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersdeliveryadress` (
  `AdressId` int NOT NULL,
  `PostCode` varchar(6) NOT NULL,
  `Country` varchar(52) NOT NULL,
  `City` varchar(45) NOT NULL,
  `Flat` tinyint NOT NULL,
  `Block` tinytext,
  `UserId` int NOT NULL,
  PRIMARY KEY (`AdressId`),
  KEY `UserIdRefer_idx` (`UserId`),
  CONSTRAINT `UserIdRefer` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersdeliveryadress`
--

LOCK TABLES `usersdeliveryadress` WRITE;
/*!40000 ALTER TABLE `usersdeliveryadress` DISABLE KEYS */;
/*!40000 ALTER TABLE `usersdeliveryadress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-24  9:24:49
