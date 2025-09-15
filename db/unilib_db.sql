-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: unilib_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_authors_name` (`full_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (1,'Кормен Т.Х., Лейзерсон Ч.И.','2025-09-06 15:28:12'),(2,'Сивухин Д.В.','2025-09-06 15:28:12'),(3,'Реутов О.А., Курц А.Л.','2025-09-06 15:28:12'),(4,'Соловьев С.М.','2025-09-06 15:28:12'),(5,'Розенталь Д.Э.','2025-09-06 15:28:12'),(6,'Пиндайк Р., Рубинфелд Д.','2025-09-06 15:28:12'),(7,'Альбертс Б., Джонсон А.','2025-09-06 15:28:12'),(8,'Зорич В.А.','2025-09-06 15:28:12'),(9,'Страуструп Б.','2025-09-06 15:28:12'),(10,'Танненбаум Э.','2025-09-06 15:28:12'),(11,'Кнут Д.','2025-09-06 15:28:12'),(12,'Гамма Э., Хелм Р.','2025-09-06 15:28:12'),(13,'Мартин Р.','2025-09-06 15:28:12'),(14,'Фаулер М.','2025-09-06 15:28:12'),(15,'Макконнелл С.','2025-09-06 15:28:12'),(16,'рмцушщмр','2025-09-13 08:21:47');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_faculties`
--

DROP TABLE IF EXISTS `book_faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_faculties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `faculty_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_book_faculty` (`book_id`,`faculty_id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `book_faculties_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `book_faculties_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_faculties`
--

LOCK TABLES `book_faculties` WRITE;
/*!40000 ALTER TABLE `book_faculties` DISABLE KEYS */;
INSERT INTO `book_faculties` VALUES (3,2,1,'2025-09-06 15:28:12'),(4,3,1,'2025-09-06 15:28:12'),(5,4,1,'2025-09-06 15:28:12'),(6,4,2,'2025-09-06 15:28:12'),(7,5,1,'2025-09-06 15:28:12'),(8,6,1,'2025-09-06 15:28:12'),(9,7,1,'2025-09-06 15:28:12'),(10,8,1,'2025-09-06 15:28:12'),(11,16,1,'2025-09-06 15:28:12'),(12,16,2,'2025-09-06 15:28:12'),(13,17,1,'2025-09-06 15:28:12'),(14,9,3,'2025-09-06 15:28:12'),(15,9,2,'2025-09-06 15:28:12'),(16,10,4,'2025-09-06 15:28:12'),(17,10,5,'2025-09-06 15:28:12'),(18,11,5,'2025-09-06 15:28:12'),(19,11,4,'2025-09-06 15:28:12'),(20,12,2,'2025-09-06 15:28:12'),(21,12,3,'2025-09-06 15:28:12'),(22,12,1,'2025-09-06 15:28:12'),(23,18,3,'2025-09-06 15:28:12'),(24,18,2,'2025-09-06 15:28:12'),(25,19,4,'2025-09-06 15:28:12'),(26,19,5,'2025-09-06 15:28:12'),(27,20,5,'2025-09-06 15:28:12'),(28,13,7,'2025-09-06 15:28:12'),(29,14,6,'2025-09-06 15:28:12'),(30,15,8,'2025-09-06 15:28:12'),(36,1,1,'2025-09-08 10:23:38'),(37,1,2,'2025-09-08 10:23:38'),(38,24,13,'2025-09-13 08:21:47');
/*!40000 ALTER TABLE `book_faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_loans`
--

DROP TABLE IF EXISTS `book_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `student_id` int NOT NULL,
  `loan_date` date NOT NULL DEFAULT (curdate()),
  `return_date` date DEFAULT NULL,
  `due_date` date NOT NULL,
  `status` enum('active','returned','overdue') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_book_loan` (`book_id`),
  KEY `idx_student_loan` (`student_id`),
  KEY `idx_loan_date` (`loan_date`),
  KEY `idx_status` (`status`),
  KEY `idx_book_loans_dates` (`loan_date`,`due_date`),
  KEY `idx_book_loans_status` (`status`),
  KEY `idx_loan_book_student` (`book_id`,`student_id`),
  KEY `idx_loans_active` (`book_id`,`status`,`loan_date`),
  CONSTRAINT `book_loans_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `book_loans_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_loans`
--

LOCK TABLES `book_loans` WRITE;
/*!40000 ALTER TABLE `book_loans` DISABLE KEYS */;
INSERT INTO `book_loans` VALUES (1,1,1,'2024-01-15',NULL,'2024-02-15','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(2,2,1,'2024-01-20',NULL,'2024-02-20','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(3,12,6,'2024-01-10',NULL,'2024-02-10','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(4,9,10,'2024-01-25',NULL,'2024-02-25','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(5,10,13,'2024-01-18',NULL,'2024-02-18','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(6,11,16,'2024-01-22',NULL,'2024-02-22','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(7,13,21,'2024-01-12',NULL,'2024-02-12','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(8,14,19,'2024-01-28',NULL,'2024-02-28','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(9,15,23,'2024-01-30',NULL,'2024-03-01','active','2025-09-06 15:28:12','2025-09-06 15:28:12'),(10,3,2,'2023-12-01',NULL,'2024-01-01','overdue','2025-09-06 15:28:12','2025-09-06 15:28:12'),(11,5,3,'2023-12-15',NULL,'2024-01-15','overdue','2025-09-06 15:28:12','2025-09-06 15:28:12'),(12,1,2,'2023-11-01',NULL,'2023-12-01','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(13,2,3,'2023-11-05',NULL,'2023-12-05','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(14,4,1,'2023-10-15',NULL,'2023-11-15','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(15,6,4,'2023-11-20',NULL,'2023-12-20','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(16,7,5,'2023-12-01',NULL,'2024-01-01','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(17,8,2,'2023-11-10',NULL,'2023-12-10','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(18,9,11,'2023-10-20',NULL,'2023-11-20','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(19,10,14,'2023-11-25',NULL,'2023-12-25','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(20,12,7,'2023-10-30',NULL,'2023-11-30','returned','2025-09-06 15:28:12','2025-09-06 15:28:12'),(21,15,24,'2023-12-05',NULL,'2024-01-05','returned','2025-09-06 15:28:12','2025-09-06 15:28:12');
/*!40000 ALTER TABLE `book_loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` int NOT NULL,
  `publisher_id` int NOT NULL,
  `year` int NOT NULL,
  `pages` int NOT NULL,
  `illustrations` int DEFAULT '0',
  `price` decimal(10,2) NOT NULL,
  `branch_id` int NOT NULL,
  `copies_count` int NOT NULL DEFAULT '1',
  `students_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_title` (`title`),
  KEY `idx_author` (`author_id`),
  KEY `idx_publisher` (`publisher_id`),
  KEY `idx_branch` (`branch_id`),
  KEY `idx_year` (`year`),
  KEY `idx_books_title_fulltext` (`title`),
  KEY `idx_books_branch_year` (`branch_id`,`year`),
  KEY `idx_books_price_range` (`price`,`branch_id`),
  KEY `idx_books_search` (`title`,`author_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `books_ibfk_2` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `books_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `books_chk_1` CHECK (((`year` >= 1900) and (`year` <= 2100))),
  CONSTRAINT `books_chk_2` CHECK ((`pages` > 0)),
  CONSTRAINT `books_chk_3` CHECK ((`illustrations` >= 0)),
  CONSTRAINT `books_chk_4` CHECK ((`price` >= 0)),
  CONSTRAINT `books_chk_5` CHECK ((`copies_count` > 0)),
  CONSTRAINT `books_chk_6` CHECK ((`students_count` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Алгоритмы и структуры данных',1,1,2021,1300,162,3500.00,2,25,2,'2025-09-06 15:28:12','2025-09-08 10:23:38'),(2,'Программирование на C++',9,1,2020,896,89,2800.00,2,30,2,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(3,'Компьютерные сети',10,6,2019,945,156,3200.00,2,20,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(4,'Искусство программирования',11,1,2021,720,95,4500.00,4,15,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(5,'Паттерны проектирования',12,6,2020,368,45,2200.00,2,35,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(6,'Чистый код',13,6,2019,464,25,2100.00,2,40,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(7,'Рефакторинг',14,6,2018,532,89,2600.00,2,28,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(8,'Совершенный код',15,6,2021,896,112,3400.00,2,22,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(9,'Физика. Общий курс',2,2,2020,856,324,2200.00,1,40,2,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(10,'Органическая химия',3,3,2019,624,256,1800.00,1,30,2,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(11,'Биология. Молекулярная биология',7,7,2020,1464,456,4200.00,4,15,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(12,'Математический анализ',8,8,2019,680,234,2100.00,2,45,2,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(13,'История России с древнейших времен',4,4,2018,1024,89,1500.00,3,20,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(14,'Современный русский язык',5,5,2022,448,12,890.00,3,50,1,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(15,'Микроэкономика',6,6,2021,736,198,2800.00,1,35,2,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(16,'Дискретная математика',8,8,2020,512,156,1900.00,2,32,0,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(17,'Базы данных',10,6,2021,645,89,2700.00,2,28,0,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(18,'Квантовая физика',2,2,2019,734,298,2400.00,5,25,0,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(19,'Аналитическая химия',3,3,2020,578,178,2000.00,5,35,0,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(20,'Генетика',7,7,2021,892,234,3800.00,5,18,0,'2025-09-06 15:28:12','2025-09-06 15:30:24'),(24,'ушщрмушщ',16,13,2025,123,12,1232.00,3,112,122,'2025-09-13 08:21:47','2025-09-13 08:21:47');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Центральная библиотека','ул. Университетская, 1, Москва','+7 (495) 123-45-62','2025-09-06 15:28:12','2025-09-06 21:22:06'),(2,'Филиал \"Технический\"','ул. Политехническая, 15, Москва','+7 (495) 123-45-68','2025-09-06 15:28:12','2025-09-06 15:28:12'),(3,'Филиал \"Гуманитарный\"','ул. Культуры, 25, Москва','+7 (495) 123-45-69','2025-09-06 15:28:12','2025-09-06 15:28:12'),(4,'Книгохранилище №1','ул. Архивная, 5, Москва','+7 (495) 123-45-70','2025-09-06 15:28:12','2025-09-06 15:28:12'),(5,'Филиал \"Естественнонаучный\"','ул. Ломоносова, 12, Москва','+7 (495) 123-45-71','2025-09-06 15:28:12','2025-09-06 15:28:12');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_delete_branch` BEFORE DELETE ON `branches` FOR EACH ROW BEGIN
    DECLARE books_count INT;
    
    SELECT COUNT(*) INTO books_count 
    FROM books WHERE branch_id = OLD.id;
    
    IF books_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Нельзя удалить филиал, в котором есть книги';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_faculties_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties`
--

LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES (1,'Факультет информатики и вычислительной техники','2025-09-06 15:28:12'),(2,'Факультет математики и механики','2025-09-06 15:28:12'),(3,'Факультет физики','2025-09-06 15:28:12'),(4,'Факультет химии','2025-09-06 15:28:12'),(5,'Факультет биологии','2025-09-06 15:28:12'),(6,'Филологический факультет','2025-09-06 15:28:12'),(7,'Исторический факультет','2025-09-06 15:28:12'),(8,'Экономический факультет','2025-09-06 15:28:12'),(9,'Факультет журналистики','2025-09-06 15:28:12'),(10,'Юридический факультет','2025-09-06 15:28:12'),(11,'Психологический факультет','2025-09-06 15:28:12'),(12,'Географический факультет','2025-09-06 15:28:12'),(13,'фит','2025-09-06 20:01:02'),(14,'вит','2025-09-06 21:24:41');
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation_logs`
--

DROP TABLE IF EXISTS `operation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operation_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `operation_type` enum('CREATE','UPDATE','DELETE','VIEW') COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` int DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_operation` (`user_id`),
  KEY `idx_operation_date` (`created_at`),
  KEY `idx_table_operation` (`table_name`,`operation_type`),
  CONSTRAINT `operation_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation_logs`
--

LOCK TABLES `operation_logs` WRITE;
/*!40000 ALTER TABLE `operation_logs` DISABLE KEYS */;
INSERT INTO `operation_logs` VALUES (1,1,'UPDATE','books',1,'{\"id\": 1, \"year\": 2021, \"pages\": 1328, \"price\": \"3500.00\", \"title\": \"Алгоритмы и структуры данных\", \"author_id\": 1, \"branch_id\": 2, \"created_at\": \"2025-09-06T15:28:12.000Z\", \"updated_at\": \"2025-09-06T15:30:24.000Z\", \"copies_count\": 25, \"publisher_id\": 1, \"illustrations\": 152, \"students_count\": 2}','{\"year\": 2021, \"pages\": 1300, \"price\": \"3500.00\", \"title\": \"Алгоритмы и структуры данных\", \"author\": \"Кормен Т.Х., Лейзерсон Ч.И.\", \"branchId\": 2, \"faculties\": [\"Факультет информатики и вычислительной техники\", \"Факультет математики и механики\"], \"publisher\": \"Вильямс\", \"copiesCount\": 25, \"illustrations\": 152, \"studentsCount\": 2}','Update book','::1','2025-09-06 20:00:22'),(2,1,'CREATE','books',21,'null','{\"title\": \"фмцм\"}','Create book','::1','2025-09-06 20:01:02'),(3,1,'DELETE','books',21,'{\"id\": 21, \"year\": 2025, \"pages\": 123, \"price\": \"1231.00\", \"title\": \"фмцм\", \"author_id\": 1, \"branch_id\": 2, \"created_at\": \"2025-09-06T20:01:02.000Z\", \"updated_at\": \"2025-09-06T20:01:02.000Z\", \"copies_count\": 123, \"publisher_id\": 1, \"illustrations\": 1231, \"students_count\": 12}','null','Delete book','::1','2025-09-06 20:01:31'),(4,1,'CREATE','branches',6,'null','{\"name\": \"фацуфа\", \"phone\": \"+79998791151\", \"address\": \"Полевая 1\"}','Create branch','::1','2025-09-06 20:02:16'),(5,1,'DELETE','branches',6,'{\"id\": 6, \"name\": \"фацуфа\", \"phone\": \"+79998791151\", \"address\": \"Полевая 1\", \"created_at\": \"2025-09-06T20:02:16.000Z\", \"updated_at\": \"2025-09-06T20:02:16.000Z\"}','null','Delete branch','::1','2025-09-06 20:02:30'),(6,2,'CREATE','books',22,'null','{\"title\": \"мфцм\"}','Create book','::1','2025-09-06 20:05:35'),(7,1,'DELETE','books',22,'{\"id\": 22, \"year\": 2025, \"pages\": 121, \"price\": \"2131.00\", \"title\": \"мфцм\", \"author_id\": 1, \"branch_id\": 2, \"created_at\": \"2025-09-06T20:05:35.000Z\", \"updated_at\": \"2025-09-06T20:05:35.000Z\", \"copies_count\": 1, \"publisher_id\": 1, \"illustrations\": 123, \"students_count\": 2}','null','Delete book','::1','2025-09-06 20:06:12'),(8,1,'UPDATE','branches',1,'{\"id\": 1, \"name\": \"Центральная библиотека\", \"phone\": \"+7 (495) 123-45-67\", \"address\": \"ул. Университетская, 1, Москва\", \"created_at\": \"2025-09-06T15:28:12.000Z\", \"updated_at\": \"2025-09-06T15:28:12.000Z\"}','{\"id\": 1, \"name\": \"Центральная библиотека\", \"phone\": \"+7 (495) 123-45-62\", \"address\": \"ул. Университетская, 1, Москва\"}','Update branch','::1','2025-09-06 21:22:06'),(9,1,'CREATE','books',23,'null','{\"title\": \"ьщшутмшщу\"}','Create book','::1','2025-09-06 21:24:41'),(10,1,'DELETE','books',23,'{\"id\": 23, \"year\": 2025, \"pages\": 12121, \"price\": \"1231.00\", \"title\": \"ьщшутмшщу\", \"author_id\": 5, \"branch_id\": 2, \"created_at\": \"2025-09-06T21:24:41.000Z\", \"updated_at\": \"2025-09-06T21:24:41.000Z\", \"copies_count\": 221, \"publisher_id\": 1, \"illustrations\": 211, \"students_count\": 123}','null','Delete book','::1','2025-09-06 21:24:46'),(11,1,'UPDATE','books',1,'{\"id\": 1, \"year\": 2021, \"pages\": 1300, \"price\": \"3500.00\", \"title\": \"Алгоритмы и структуры данных\", \"author_id\": 1, \"branch_id\": 2, \"created_at\": \"2025-09-06T15:28:12.000Z\", \"updated_at\": \"2025-09-06T20:00:22.000Z\", \"copies_count\": 25, \"publisher_id\": 1, \"illustrations\": 152, \"students_count\": 2}','{\"id\": 1, \"year\": 2021, \"pages\": 1300, \"price\": \"3500.00\", \"title\": \"Алгоритмы и структуры данных\", \"author\": \"Кормен Т.Х., Лейзерсон Ч.И.\", \"branchId\": 2, \"faculties\": [\"Факультет информатики и вычислительной техники\", \"Факультет математики и механики\"], \"publisher\": \"Вильямс\", \"copiesCount\": 25, \"illustrations\": 162, \"studentsCount\": 2}','Update book','::1','2025-09-08 10:23:38'),(12,1,'CREATE','books',24,'null','{\"title\": \"ушщрмушщ\"}','Create book','::1','2025-09-13 08:21:47');
/*!40000 ALTER TABLE `operation_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publishers`
--

DROP TABLE IF EXISTS `publishers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publishers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_publishers_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publishers`
--

LOCK TABLES `publishers` WRITE;
/*!40000 ALTER TABLE `publishers` DISABLE KEYS */;
INSERT INTO `publishers` VALUES (1,'Вильямс','2025-09-06 15:28:12'),(2,'Физматлит','2025-09-06 15:28:12'),(3,'МГУ','2025-09-06 15:28:12'),(4,'АСТ','2025-09-06 15:28:12'),(5,'Дрофа','2025-09-06 15:28:12'),(6,'Питер','2025-09-06 15:28:12'),(7,'Мир','2025-09-06 15:28:12'),(8,'МЦНМО','2025-09-06 15:28:12'),(9,'Просвещение','2025-09-06 15:28:12'),(10,'Высшая школа','2025-09-06 15:28:12'),(11,'БХВ-Петербург','2025-09-06 15:28:12'),(12,'Лань','2025-09-06 15:28:12'),(13,'црмтшцд','2025-09-13 08:21:47');
/*!40000 ALTER TABLE `publishers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `faculty_id` int NOT NULL,
  `student_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_number` (`student_number`),
  KEY `idx_students_faculty` (`faculty_id`,`full_name`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Иванов Петр Сергеевич',1,'IT-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(2,'Петрова Анна Александровна',1,'IT-2021-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(3,'Сидоров Михаил Владимирович',1,'IT-2020-003','2025-09-06 15:28:12','2025-09-06 15:28:12'),(4,'Козлова Елена Игоревна',1,'IT-2022-004','2025-09-06 15:28:12','2025-09-06 15:28:12'),(5,'Николаев Алексей Дмитриевич',1,'IT-2021-005','2025-09-06 15:28:12','2025-09-06 15:28:12'),(6,'Морозова Виктория Павловна',2,'MATH-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(7,'Волков Денис Александрович',2,'MATH-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(8,'Соколова Мария Викторовна',2,'MATH-2022-003','2025-09-06 15:28:12','2025-09-06 15:28:12'),(9,'Федоров Игорь Петрович',2,'MATH-2021-004','2025-09-06 15:28:12','2025-09-06 15:28:12'),(10,'Лебедев Андрей Сергеевич',3,'PHYS-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(11,'Кузнецова Ольга Владимировна',3,'PHYS-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(12,'Попов Дмитрий Александрович',3,'PHYS-2022-003','2025-09-06 15:28:12','2025-09-06 15:28:12'),(13,'Новикова Татьяна Игоревна',4,'CHEM-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(14,'Орлов Максим Викторович',4,'CHEM-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(15,'Васильева Анастасия Сергеевна',4,'CHEM-2021-003','2025-09-06 15:28:12','2025-09-06 15:28:12'),(16,'Смирнов Артем Дмитриевич',5,'BIO-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(17,'Григорьева Екатерина Павловна',5,'BIO-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(18,'Жуков Роман Александрович',5,'BIO-2022-003','2025-09-06 15:28:12','2025-09-06 15:28:12'),(19,'Макарова Юлия Владимировна',6,'PHIL-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(20,'Белов Константин Игоревич',6,'PHIL-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(21,'Королева Алена Сергеевна',7,'HIST-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(22,'Рыбаков Павел Дмитриевич',7,'HIST-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(23,'Захарова Виолетта Александровна',8,'ECON-2021-001','2025-09-06 15:28:12','2025-09-06 15:28:12'),(24,'Медведев Степан Викторович',8,'ECON-2020-002','2025-09-06 15:28:12','2025-09-06 15:28:12'),(25,'Антонова Полина Игоревна',8,'ECON-2021-003','2025-09-06 15:28:12','2025-09-06 15:28:12');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','librarian','viewer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'viewer',
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin','Администратор системы','admin@university.edu',1,'2025-09-06 15:28:12','2025-09-06 15:28:12'),(2,'librarian','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','librarian','Главный библиотекарь','librarian@university.edu',1,'2025-09-06 15:28:12','2025-09-06 15:28:12'),(6,'admin1','$2b$10$Bcby9zrU1ezpMmfuWnHFm.Khas8dTJR3yCm3XMeKycIE2Qc8zjaO2','admin','Администратор','qwerty@qwerty.ru',1,'2025-09-08 10:25:51','2025-09-08 10:26:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_books_full`
--

DROP TABLE IF EXISTS `v_books_full`;
/*!50001 DROP VIEW IF EXISTS `v_books_full`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_books_full` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `author`,
 1 AS `publisher`,
 1 AS `year`,
 1 AS `pages`,
 1 AS `illustrations`,
 1 AS `price`,
 1 AS `branch_name`,
 1 AS `branch_address`,
 1 AS `copies_count`,
 1 AS `students_count`,
 1 AS `faculties`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_branch_statistics`
--

DROP TABLE IF EXISTS `v_branch_statistics`;
/*!50001 DROP VIEW IF EXISTS `v_branch_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_branch_statistics` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `address`,
 1 AS `total_books`,
 1 AS `total_copies`,
 1 AS `total_students`,
 1 AS `average_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_books_full`
--

/*!50001 DROP VIEW IF EXISTS `v_books_full`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_books_full` AS select `b`.`id` AS `id`,`b`.`title` AS `title`,`a`.`full_name` AS `author`,`p`.`name` AS `publisher`,`b`.`year` AS `year`,`b`.`pages` AS `pages`,`b`.`illustrations` AS `illustrations`,`b`.`price` AS `price`,`br`.`name` AS `branch_name`,`br`.`address` AS `branch_address`,`b`.`copies_count` AS `copies_count`,`b`.`students_count` AS `students_count`,group_concat(`f`.`name` separator ', ') AS `faculties`,`b`.`created_at` AS `created_at`,`b`.`updated_at` AS `updated_at` from (((((`books` `b` join `authors` `a` on((`b`.`author_id` = `a`.`id`))) join `publishers` `p` on((`b`.`publisher_id` = `p`.`id`))) join `branches` `br` on((`b`.`branch_id` = `br`.`id`))) left join `book_faculties` `bf` on((`b`.`id` = `bf`.`book_id`))) left join `faculties` `f` on((`bf`.`faculty_id` = `f`.`id`))) group by `b`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_branch_statistics`
--

/*!50001 DROP VIEW IF EXISTS `v_branch_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_branch_statistics` AS select `br`.`id` AS `id`,`br`.`name` AS `name`,`br`.`address` AS `address`,count(`b`.`id`) AS `total_books`,sum(`b`.`copies_count`) AS `total_copies`,sum(`b`.`students_count`) AS `total_students`,avg(`b`.`price`) AS `average_price` from (`branches` `br` left join `books` `b` on((`br`.`id` = `b`.`branch_id`))) group by `br`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-15 15:41:26
