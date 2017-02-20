DROP DATABASE IF EXISTS `douga`;

CREATE DATABASE `douga` DEFAULT CHARSET utf8mb4;

USE `douga`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(320) NOT NULL,
  `name` varchar(16) NOT NULL,
  `password` varchar(64) NOT NULL,
  `salt` varchar(16) NOT NULL,
  `icon` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `update_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`mail`)
);

CREATE TABLE `posts` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `text` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
);
