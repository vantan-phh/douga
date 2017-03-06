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
  `follow_count` int(11) NOT NULL,
  `follower_count` int(11) NOT NULL,
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

CREATE TABLE `to_follow` (
  `follower_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL
)

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
)
