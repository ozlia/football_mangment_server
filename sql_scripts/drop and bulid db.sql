DROP TABLE [dbo].[events];
DROP TABLE [dbo].[favorite_matches];
DROP TABLE [dbo].[league_referees];
DROP TABLE [dbo].[roles];
DROP TABLE [dbo].[scheduling_policy];
DROP TABLE [dbo].[match];
DROP TABLE [dbo].[league];
DROP TABLE [dbo].[users];

CREATE TABLE dbo.users(
	user_id [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	username [varchar](30) NOT NULL UNIQUE,
	firstname [varchar](300) NOT NULL,
	lastname [varchar](300) NOT NULL,
	country [varchar](300) NOT NULL,
	password [varchar](300) NOT NULL,
	email [varchar](300) NOT NULL,
	profile_picture [varchar](300) NOT NULL
);
CREATE TABLE [dbo].[league](
    league_id [varchar](300) NOT NULL PRIMARY KEY,
    league_name [varchar](300) NOT NULL
);
CREATE TABLE [dbo].[match](
	match_id [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	home_team [varchar](300) NOT NULL,
	away_team [varchar](300) NOT NULL,
	league [varchar] (300) NOT NULL,
	season [varchar] (300) NOT NULL,
	stage [varchar] (300) NOT NULL,
	court [varchar] (300) NOT NULL,
	referee_name [varchar](300) NOT NULL,
	date [varchar](300) NOT NULL,
	score [varchar] (300),
	CONSTRAINT FK_match_league FOREIGN KEY (league)
	REFERENCES league(league_id)
);
CREATE TABLE scheduling_policy(
	league_id [varchar](300) NOT NULL,
	policy_name [varchar](30) NOT NULL,
	PRIMARY KEY(policy_name, league_id),
	CONSTRAINT FK_favorite_league_id FOREIGN KEY (league_id)
	REFERENCES  league(league_id)
);
CREATE TABLE [dbo].[roles](
    user_id [int] NOT NULL,
    role_name [varchar](300) NOT NULL,
    PRIMARY KEY(user_id, role_name),
    CONSTRAINT FK_role_user_id FOREIGN KEY (user_id)
    REFERENCES  users(user_id)
);
CREATE TABLE [dbo].[league_referees](
	user_id [int] NOT NULL,
	league_id [varchar](300) NOT NULL,
	PRIMARY KEY(user_id, league_id),
	CONSTRAINT FK_league_ref_user FOREIGN KEY (user_id)
	REFERENCES users(user_id),
	CONSTRAINT FK_league_ref_league FOREIGN KEY (league_id)
	REFERENCES league(league_id)
);
CREATE TABLE [dbo].[favorite_matches](
	user_id [int] NOT NULL,
	match_id [int] NOT NULL,
	PRIMARY KEY(user_id, match_id),
	CONSTRAINT FK_favorite_match_id FOREIGN KEY (match_id)
	REFERENCES  match(match_id),
	CONSTRAINT FK_favorite_user_id FOREIGN KEY (user_id)
	REFERENCES  users(user_id)

);
CREATE TABLE [dbo].[events](
    match_id [int] NOT NULL,
    date [varchar](100) NOT NULL,
    min_in_game [int] NOT NULL,
    event_type [varchar](100) NOT NULL,
    description [varchar](100) NOT NULL,
    PRIMARY KEY(match_id, date, min_in_game, event_type, description),
    CONSTRAINT FK_match_id FOREIGN KEY (match_id)
    REFERENCES match(match_id)
);
INSERT INTO users (username,firstname,lastname,country,password,email,profile_picture) VALUES(
    'Dani_Uni','May','Suban','string','$2a$11$jLgUBWrxtDXMumtPmg5UX.W2kxprBFYThfLcCBwcgTx.mi1jXPkGm','Suban@gmail.com','https://res.cloudinary.com/dswkzsdoq/image/upload/v1620738869/20171122_132608_zvrw97.jpg'
);
INSERT INTO roles VALUES ((SELECT user_id FROM users WHERE username = 'Dani_Uni'), 'union_rep');
INSERT INTO league (league_id,league_name) VALUES('271','superliga');