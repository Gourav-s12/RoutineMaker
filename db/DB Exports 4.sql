CREATE DATABASE  IF NOT EXISTS `college` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `college`;
-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: college
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `sem`
--

DROP TABLE IF EXISTS `sem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sem` (
  `sem_no` varchar(45) NOT NULL,
  `fk_time_schedule_name` varchar(45) NOT NULL,
  PRIMARY KEY (`sem_no`,`fk_time_schedule_name`),
  KEY `fk_time_schedule_name_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_time_schedule_name2` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sem`
--

LOCK TABLES `sem` WRITE;
/*!40000 ALTER TABLE `sem` DISABLE KEYS */;
INSERT INTO `sem` VALUES ('IV','CCP Routine 2020'),('VI','CCP Routine 2020');
/*!40000 ALTER TABLE `sem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_teacher`
--

DROP TABLE IF EXISTS `sub_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_teacher` (
  `fk_sub_id` int(25) NOT NULL,
  `fk_tr_id` int(11) NOT NULL,
  `fk_time_schedule_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`fk_sub_id`,`fk_tr_id`),
  KEY `fk_tr_id_idx` (`fk_tr_id`),
  KEY `fk_time_schedule_name6_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_sub_id` FOREIGN KEY (`fk_sub_id`) REFERENCES `subject` (`sub_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_time_schedule_name6` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`) ON DELETE CASCADE,
  CONSTRAINT `fk_tr_id` FOREIGN KEY (`fk_tr_id`) REFERENCES `teacher` (`tr_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_teacher`
--

LOCK TABLES `sub_teacher` WRITE;
/*!40000 ALTER TABLE `sub_teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `sub_id` int(25) NOT NULL AUTO_INCREMENT,
  `sub_name` varchar(45) NOT NULL,
  `fk_sem_no` varchar(45) DEFAULT NULL,
  `hrs_per_week` int(25) NOT NULL,
  `lab_or_not` tinyint(4) NOT NULL,
  `min_slot_length` int(25) NOT NULL,
  `slot_pref` longtext NOT NULL,
  `fk_time_schedule_name` varchar(45) NOT NULL,
  PRIMARY KEY (`sub_id`),
  KEY `fk_sem_no_idx` (`fk_sem_no`),
  KEY `fk_time_schedule_name4_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_sem_no` FOREIGN KEY (`fk_sem_no`) REFERENCES `sem` (`sem_no`) ON DELETE SET NULL,
  CONSTRAINT `fk_time_schedule_name4` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='									';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (20,'Networking','IV',3,0,1,'..Slot Pref..','CCP Routine 2020'),(21,'Microprocessor','IV',3,0,1,'..Slot Pref..','CCP Routine 2020'),(22,'Microprocessor Lab','IV',3,1,1,'..Slot Pref..','CCP Routine 2020');
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `tr_id` int(11) NOT NULL AUTO_INCREMENT,
  `tr_name` varchar(45) NOT NULL,
  `max_continuois_period` int(11) DEFAULT NULL,
  `time_matrix` longtext NOT NULL,
  `fk_time_schedule_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tr_id`),
  KEY `fk_time_schedule_name5_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_time_schedule_name5` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (19,'G.D.',5,'..Time Matirx..','CCP Routine 2020'),(20,'B.K.',5,'..Time Matirx..','CCP Routine 2020');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_schedule`
--

DROP TABLE IF EXISTS `time_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_schedule` (
  `time_schedule_name` varchar(45) NOT NULL,
  `ins_name` varchar(45) NOT NULL,
  `start_time` time NOT NULL,
  `slot_count` int(11) NOT NULL,
  `slot_duration_mins` int(11) NOT NULL,
  `recess_duration` int(11) NOT NULL,
  `fk_email` varchar(45) NOT NULL,
  PRIMARY KEY (`time_schedule_name`),
  KEY `fk_email_idx` (`fk_email`),
  CONSTRAINT `fk_email` FOREIGN KEY (`fk_email`) REFERENCES `user` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_schedule`
--

LOCK TABLES `time_schedule` WRITE;
/*!40000 ALTER TABLE `time_schedule` DISABLE KEYS */;
INSERT INTO `time_schedule` VALUES ('CCP Routine 2020','CCP','10:30:00',6,60,20,'ccp@gmail.com');
/*!40000 ALTER TABLE `time_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('ccp@gmail.com','ccp','DGABS');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `working_days`
--

DROP TABLE IF EXISTS `working_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `working_days` (
  `days_name` varchar(45) NOT NULL,
  `full_half` varchar(5) NOT NULL,
  `fk_time_schedule_name` varchar(45) NOT NULL,
  PRIMARY KEY (`days_name`,`fk_time_schedule_name`),
  KEY `fk_time_schedule_name_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_time_schedule_name` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `working_days`
--

LOCK TABLES `working_days` WRITE;
/*!40000 ALTER TABLE `working_days` DISABLE KEYS */;
INSERT INTO `working_days` VALUES ('FRI','full','CCP Routine 2020'),('MON','full','CCP Routine 2020'),('SAT','half','CCP Routine 2020'),('SUN','none','CCP Routine 2020'),('THU','full','CCP Routine 2020'),('TUE','full','CCP Routine 2020'),('WED','full','CCP Routine 2020');
/*!40000 ALTER TABLE `working_days` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-28 14:47:48
