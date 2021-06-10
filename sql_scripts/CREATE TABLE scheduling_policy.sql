CREATE TABLE scheduling_policy(
	league_id [varchar](300) NOT NULL,
	policy_name [varchar](30) NOT NULL,
	PRIMARY KEY(policy_name, league_id),
	CONSTRAINT FK_favorite_league_id FOREIGN KEY (league_id)
	REFERENCES  league(league_id)
)