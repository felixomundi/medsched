-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 22, 2024 at 06:18 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medsched`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int NOT NULL,
  `doctorId` int NOT NULL,
  `appointmenttypeId` int NOT NULL,
  `appointmentDate` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `available` tinyint(1) DEFAULT '0',
  `status` enum('scheduled','cancelled','completed') DEFAULT 'scheduled',
  `specialty` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `patientId` (`patientId`),
  KEY `doctorId` (`doctorId`),
  KEY `appointmenttypeId` (`appointmenttypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patientId`, `doctorId`, `appointmenttypeId`, `appointmentDate`, `startTime`, `endTime`, `available`, `status`, `specialty`, `createdAt`, `updatedAt`) VALUES
(26, 6, 16, 16, '2024-08-10', '13:20:00', '14:00:00', 0, 'completed', 'Cardiology', '2024-07-20 16:10:06', '2024-07-20 16:30:26'),
(27, 8, 16, 16, '2024-07-20', '14:00:00', '14:40:00', 0, 'scheduled', 'Cardiology', '2024-07-20 18:20:57', '2024-07-20 18:23:33');

-- --------------------------------------------------------

--
-- Table structure for table `appointmenttypes`
--

DROP TABLE IF EXISTS `appointmenttypes`;
CREATE TABLE IF NOT EXISTS `appointmenttypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT '0',
  `cost` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointmenttypes`
--

INSERT INTO `appointmenttypes` (`id`, `name`, `description`, `duration`, `cost`, `createdAt`, `updatedAt`) VALUES
(16, 'Specialist Referral', 'Specialist Referral', 40, '100.00', '2024-07-20 15:00:44', '2024-07-20 15:54:55');

-- --------------------------------------------------------

--
-- Table structure for table `doctorspecialties`
--

DROP TABLE IF EXISTS `doctorspecialties`;
CREATE TABLE IF NOT EXISTS `doctorspecialties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `specialty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `doctorspecialties`
--

INSERT INTO `doctorspecialties` (`id`, `userId`, `specialty`, `createdAt`, `updatedAt`) VALUES
(10, 16, 'Cardiology', '2024-07-13 10:01:28', '2024-07-13 10:01:28'),
(11, 16, 'Physical Medicine and Rehabilitation (PM&R)', '2024-07-13 10:01:28', '2024-07-13 10:01:28'),
(12, 16, 'Endocrinology', '2024-07-13 10:01:28', '2024-07-13 10:01:28'),
(16, 31, 'Anesthesiology', '2024-07-21 09:23:54', '2024-07-21 09:23:54'),
(17, 31, 'Emergency Medicine', '2024-07-21 09:23:54', '2024-07-21 09:23:54');

-- --------------------------------------------------------

--
-- Table structure for table `medicalhistories`
--

DROP TABLE IF EXISTS `medicalhistories`;
CREATE TABLE IF NOT EXISTS `medicalhistories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointmentId` int NOT NULL,
  `visitDate` datetime DEFAULT NULL,
  `symptoms` text,
  `diagnosis` text,
  `medications` text,
  `notes` text,
  `followUpDate` datetime DEFAULT NULL,
  `height` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `bloodPressure` varchar(255) DEFAULT NULL,
  `heartRate` varchar(255) DEFAULT NULL,
  `allergies` text,
  `pastSurgeries` text,
  `familyHistory` text,
  `socialHistory` text,
  `diet` text,
  `exercise` text,
  `smoking` text,
  `alcohol` text,
  `doctorId` int NOT NULL,
  `patientId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `appointmentId` (`appointmentId`),
  KEY `doctorId` (`doctorId`),
  KEY `patientId` (`patientId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `medicalhistories`
--

INSERT INTO `medicalhistories` (`id`, `appointmentId`, `visitDate`, `symptoms`, `diagnosis`, `medications`, `notes`, `followUpDate`, `height`, `weight`, `bloodPressure`, `heartRate`, `allergies`, `pastSurgeries`, `familyHistory`, `socialHistory`, `diet`, `exercise`, `smoking`, `alcohol`, `doctorId`, `patientId`, `createdAt`, `updatedAt`) VALUES
(5, 26, '2024-08-10 00:00:00', 'This', 'this', 'this', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', '', '', '', 16, 6, '2024-07-20 16:30:26', '2024-07-20 16:30:26');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
CREATE TABLE IF NOT EXISTS `reminders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointmentId` int NOT NULL,
  `sentAt` datetime NOT NULL,
  `method` varchar(255) NOT NULL,
  `status` enum('sent','failed') DEFAULT 'sent',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `appointmentId` (`appointmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `appointmentId`, `sentAt`, `method`, `status`, `createdAt`, `updatedAt`) VALUES
(9, 26, '2024-07-20 16:10:36', 'email', 'failed', '2024-07-20 16:10:36', '2024-07-20 16:10:36');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240616090537-create-user.js'),
('20240616102602-create-token.js'),
('20240705194815-create-appointment-type.js'),
('20240706200536-create-appointment.js'),
('20240708122154-create-reminder.js'),
('20240713084624-create-doctor-specialty.js'),
('20240714124735-create-medical-history.js');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `expiryDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT '+254712345678',
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `password`, `street`, `city`, `state`, `zipcode`, `gender`, `dob`, `createdAt`, `updatedAt`) VALUES
(1, 'Doctor Doe', 'doctor.doe@gmail.com', '+254712345678', 'doctor', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', 'xx', 'xx', 'xx', 'xx', 'Male', '2024-07-15', '2024-07-04 04:55:57', '2024-07-21 10:01:48'),
(2, 'Admin Example', 'admin.example@gmail.com', '+254712345678', 'admin', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', 'SN', 'NA', 'SP', 'SX', 'Female', '2024-07-21', '2024-07-05 05:10:58', '2024-07-21 09:28:40'),
(3, 'Doctor.doe', 'doctor.doe@example.com', '+254712345678', 'doctor', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', 'ok street', NULL, NULL, NULL, 'Male', '2012-12-12', '2024-07-06 21:42:40', '2024-07-06 21:42:40'),
(4, 'Doctor.doe', 'doe.doctor@example.com', '+254712345678', 'doctor', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', 'ok street', NULL, NULL, NULL, 'Male', '2012-12-12', '2024-07-06 21:43:26', '2024-07-06 21:43:26'),
(5, 'Admin Benjamin Green', 'benjamin.green@example.com', '+254712345678', 'admin', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', '999 Oak Rd', 'Baltimore', 'Maryland', '21001', 'Male', '1982-04-14', '2024-07-06 21:52:16', '2024-07-06 21:52:16'),
(6, 'Patient Sophia Martinez', 'sophia.martinez@example.com', '+254712345678', 'user', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', '111 Pine Ave', NULL, 'Indiana', NULL, 'Female', '1991-01-19', '2024-07-06 21:52:43', '2024-07-06 21:52:43'),
(7, 'Dr. Samantha Hall', 'samantha.hall@example.com', '+254712345678', 'doctor', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', '888 Maple Ln', 'Minneapolis', 'Minnesota', '55001', 'Female', '1977-09-27', '2024-07-06 21:53:08', '2024-07-06 21:53:08'),
(8, 'Patient Joshua Wright', 'patient.doe@gmail.com', '+254712345678', 'user', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', 'xx', 'xx', 'xx', 'xx', '', '2024-07-15', '2024-07-06 21:53:36', '2024-07-15 14:01:53'),
(16, 'Example Admin', 'exampleadmin@gmail.com', '+254712345678', 'doctor', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', NULL, NULL, NULL, NULL, 'Male', NULL, '2024-07-13 10:01:28', '2024-07-13 10:01:28'),
(17, 'Patient Joshua Wright', 'joshua.wright@example.com', '+254712345678', 'patient', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', '777 Elm Dr', 'Milwaukee', 'Wisconsin', '53001', 'Male', '1992-06-18', '2024-07-21 08:23:05', '2024-07-21 08:23:05'),
(31, 'sat@example', 'sat@example.com', 'sat@example', 'doctor', '$2a$10$NHMBguuWyis0YQTr6VDTzOqSSd0bSQbu2ZHoMJXLRl9FJq60YEe6.', 'sat@example', 'sat@example', 'sat@example', 'sat@example', 'Female', '2024-07-21', '2024-07-21 09:23:54', '2024-07-21 10:50:43');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`appointmenttypeId`) REFERENCES `appointmenttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `doctorspecialties`
--
ALTER TABLE `doctorspecialties`
  ADD CONSTRAINT `doctorspecialties_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `medicalhistories`
--
ALTER TABLE `medicalhistories`
  ADD CONSTRAINT `medicalhistories_ibfk_1` FOREIGN KEY (`appointmentId`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medicalhistories_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medicalhistories_ibfk_3` FOREIGN KEY (`patientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`appointmentId`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
