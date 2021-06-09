const league_utils = require("../../routes/utils/league_utils");
const regularLeaguePolicy = require("../../algorithms/regularLeaguePolicy");
const pairs = [
    {
      home_team: {
        name: "A",
        venue_id: 12,
      },
      away_team: {
        name: "B",
        venue_id: 12,
      },
    },
    {
      home_team: {
        name: "C",
        venue_id: 12,
      },
      away_team: {
        name: "A",
        venue_id: 12,
      },
    },
    {
      home_team: {
        name: "A",
        venue_id: 12,
      },
      away_team: {
        name: "D",
        venue_id: 12,
      },
    },
    {
      home_team: {
        name: "C",
        venue_id: 12,
      },
      away_team: {
        name: "B",
        venue_id: 12,
      },
    },
    {
      home_team: {
        name: "B",
        venue_id: 12,
      },
      away_team: {
        name: "D",
        venue_id: 12,
      },
    },
    {
      home_team: {
        name: "D",
        venue_id: 12,
      },
      away_team: {
        name: "C",
        venue_id: 12,
      },
    },
  ];
const fixtures = [
    [
      {
        home_team: {
          name: "A",
          venue_id: 12,
        },
        away_team: {
          name: "B",
          venue_id: 12,
        },
      },
      {
        home_team: {
          name: "D",
          venue_id: 12,
        },
        away_team: {
          name: "C",
          venue_id: 12,
        },
      },
    ],
    [
      {
        home_team: {
          name: "C",
          venue_id: 12,
        },
        away_team: {
          name: "A",
          venue_id: 12,
        },
      },
      {
        home_team: {
          name: "B",
          venue_id: 12,
        },
        away_team: {
          name: "D",
          venue_id: 12,
        },
      },
    ],
    [
      {
        home_team: {
          name: "A",
          venue_id: 12,
        },
        away_team: {
          name: "D",
          venue_id: 12,
        },
      },
      {
        home_team: {
          name: "C",
          venue_id: 12,
        },
        away_team: {
          name: "B",
          venue_id: 12,
        },
      },
    ],
  ];

test("create reagular policy", () => {
    league_utils.setPolicy("reagular Season");
    expect(league_utils.runSchedulingPolicy());
  });
  test("create policy", () => {
    league_utils.setPolicy("policy");
    expect(league_utils.runSchedulingPolicy());
  });
  test("create pairs", () => {
      let f = regularLeaguePolicy.createPairs([{name: "A", "vanue_id": 12},{name: "B", "vanue_id": 12}, {name: "C", "vanue_id": 12}, {name: "D", "vanue_id": 12}]);
      expect(f.length).toBe(6);
  });
  test("fixture devide", () => {
    let f = regularLeaguePolicy.fixture_devide(pairs);
    expect(f.length).toBe(3);
  });
test("add matches by fixtures", async () => {
    await regularLeaguePolicy.addmatches(fixtures, 271, '2021/2022');
});
