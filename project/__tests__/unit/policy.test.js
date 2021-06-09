const DButils = require("../../routes/utils/DButils");
const regularLeaguePolicy = require("../../algorithms/regularLeaguePolicy");
jest.setTimeout(10000)
const pairs = [
  {
    home_team: {
      name: "A",
      vanue_id: 12,
    },
    away_team: {
      name: "B",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "C",
      vanue_id: 12,
    },
    away_team: {
      name: "A",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "A",
      vanue_id: 12,
    },
    away_team: {
      name: "D",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "E",
      vanue_id: 12,
    },
    away_team: {
      name: "A",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "A",
      vanue_id: 12,
    },
    away_team: {
      name: "f",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "C",
      vanue_id: 12,
    },
    away_team: {
      name: "B",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "B",
      vanue_id: 12,
    },
    away_team: {
      name: "D",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "E",
      vanue_id: 12,
    },
    away_team: {
      name: "B",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "B",
      vanue_id: 12,
    },
    away_team: {
      name: "f",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "D",
      vanue_id: 12,
    },
    away_team: {
      name: "C",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "C",
      vanue_id: 12,
    },
    away_team: {
      name: "E",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "f",
      vanue_id: 12,
    },
    away_team: {
      name: "C",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "D",
      vanue_id: 12,
    },
    away_team: {
      name: "E",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "f",
      vanue_id: 12,
    },
    away_team: {
      name: "D",
      vanue_id: 12,
    },
  },
  {
    home_team: {
      name: "E",
      vanue_id: 12,
    },
    away_team: {
      name: "f",
      vanue_id: 12,
    },
  },
];
const fixtures = [
  [
    {
      home_team: {
        name: "A",
        vanue_id: 12,
      },
      away_team: {
        name: "B",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "D",
        vanue_id: 12,
      },
      away_team: {
        name: "C",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "E",
        vanue_id: 12,
      },
      away_team: {
        name: "f",
        vanue_id: 12,
      },
    },
  ],
  [
    {
      home_team: {
        name: "C",
        vanue_id: 12,
      },
      away_team: {
        name: "A",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "B",
        vanue_id: 12,
      },
      away_team: {
        name: "D",
        vanue_id: 12,
      },
    },
  ],
  [
    {
      home_team: {
        name: "A",
        vanue_id: 12,
      },
      away_team: {
        name: "D",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "C",
        vanue_id: 12,
      },
      away_team: {
        name: "B",
        vanue_id: 12,
      },
    },
  ],
  [
    {
      home_team: {
        name: "E",
        vanue_id: 12,
      },
      away_team: {
        name: "A",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "B",
        vanue_id: 12,
      },
      away_team: {
        name: "f",
        vanue_id: 12,
      },
    },
  ],
  [
    {
      home_team: {
        name: "A",
        vanue_id: 12,
      },
      away_team: {
        name: "f",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "E",
        vanue_id: 12,
      },
      away_team: {
        name: "B",
        vanue_id: 12,
      },
    },
  ],
  [
    {
      home_team: {
        name: "C",
        vanue_id: 12,
      },
      away_team: {
        name: "E",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "f",
        vanue_id: 12,
      },
      away_team: {
        name: "D",
        vanue_id: 12,
      },
    },
  ],
  [
    {
      home_team: {
        name: "f",
        vanue_id: 12,
      },
      away_team: {
        name: "C",
        vanue_id: 12,
      },
    },
    {
      home_team: {
        name: "D",
        vanue_id: 12,
      },
      away_team: {
        name: "E",
        vanue_id: 12,
      },
    },
  ],
];

  test("create pairs", () => {
      let f = regularLeaguePolicy.createPairs([{name: "A", "vanue_id": 12},{name: "B", "vanue_id": 12}, {name: "C", "vanue_id": 12}, {name: "D", "vanue_id": 12}, {name: "E", "vanue_id": 12}, {name: "f", "vanue_id": 12}]);
      expect(f.length).toBe(15);
  });
  test("fixture devide", () => {
    let f = regularLeaguePolicy.fixture_devide(pairs);
    expect(f.length).toBe(7);
  });
  test("add matches by fixtures", async () => {
      await regularLeaguePolicy.addmatches(fixtures, 271, '2021/2022');
  });

  afterAll(async () => {
      await DButils.execQuery(
        `DELETE FROM match WHERE home_team in ('A', 'B', 'C', 'D', 'E', 'F')`
  );
    await DButils.pool.close();
  });

