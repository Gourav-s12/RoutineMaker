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
  CONSTRAINT `fk_time_schedule_name2` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sub_teacher`
--

DROP TABLE IF EXISTS `sub_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_teacher` (
  `fk_sub_id` int(25) NOT NULL,
  `fk_tr_id` int(11) NOT NULL,
  `fk_time_schedule_name` varchar(45) NOT NULL,
  PRIMARY KEY (`fk_sub_id`,`fk_tr_id`),
  KEY `fk_tr_id_idx` (`fk_tr_id`),
  KEY `fk_time_schedule_name6_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_sub_id` FOREIGN KEY (`fk_sub_id`) REFERENCES `subject` (`sub_id`),
  CONSTRAINT `fk_time_schedule_name6` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`),
  CONSTRAINT `fk_tr_id` FOREIGN KEY (`fk_tr_id`) REFERENCES `teacher` (`tr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `sub_id` int(25) NOT NULL AUTO_INCREMENT,
  `sub_name` varchar(45) NOT NULL,
  `fk_sem_no` varchar(45) NOT NULL,
  `hrs_per_week` int(25) NOT NULL,
  `lab_or_not` tinyint(4) NOT NULL,
  `other_sub` tinyint(4) NOT NULL,
  `slot_pref` longtext NOT NULL,
  `fk_time_schedule_name` varchar(45) NOT NULL,
  PRIMARY KEY (`sub_id`),
  KEY `fk_sem_no_idx` (`fk_sem_no`),
  KEY `fk_time_schedule_name4_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_sem_no` FOREIGN KEY (`fk_sem_no`) REFERENCES `sem` (`sem_no`),
  CONSTRAINT `fk_time_schedule_name4` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='									';
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `fk_time_schedule_name` varchar(45) NOT NULL,
  PRIMARY KEY (`tr_id`),
  KEY `fk_time_schedule_name5_idx` (`fk_time_schedule_name`),
  CONSTRAINT `fk_time_schedule_name5` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `recess_duration` int(11) NOT NULL,
  `fk_email` varchar(45) NOT NULL,
  PRIMARY KEY (`time_schedule_name`),
  KEY `fk_email_idx` (`fk_email`),
  CONSTRAINT `fk_email` FOREIGN KEY (`fk_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  CONSTRAINT `fk_time_schedule_name` FOREIGN KEY (`fk_time_schedule_name`) REFERENCES `time_schedule` (`time_schedule_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-02 18:13:04
