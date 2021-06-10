const DButils = require("../../routes/utils/DButils");
const regularLeaguePolicy = require("../../algorithms/regularLeaguePolicy");
let refs = ['ref_policy_test_a','ref_policy_test_b','ref_policy_test_c'];
let league_id =271;
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
  async function create_ref_in_leauge_test(username){
    try{
      await DButils.execQuery(
        `INSERT INTO users (username, firstname, lastname, country, password, email, profile_picture) VALUES
            ('${username}', 'testF', 'testL', 'testC','testP', 'testE', 'testPR')`
        );
      const user = await DButils.execQuery(
          `SELECT user_id,username FROM users WHERE username = '${username}'`
      );
      let ref_id = user[0].user_id;
      await DButils.execQuery(`INSERT INTO roles VALUES('${ref_id}','referee')`);
      await DButils.execQuery(
        `INSERT INTO league_referees VALUES('${ref_id}','${league_id}')`
      );
    }
    catch{
      throw ({message: "create ref for policy test has a problem"});
    }
  }
  async function delete_ref_in_leauge_test(username){
    try{
      const user = await DButils.execQuery(
          `SELECT user_id,username FROM users WHERE username = '${username}'`
      );
      let ref_id = user[0].user_id;
      let league_id = 271;
      await DButils.execQuery(
          `DELETE FROM league_referees WHERE user_id = '${ref_id}' AND league_id = '${league_id}'`
      );
      await DButils.execQuery(
          `DELETE FROM roles WHERE user_id = '${ref_id}' AND role_name = 'referee'`
      );
      await DButils.execQuery(
          `DELETE FROM users WHERE user_id = '${ref_id}'`
      );
  }
  catch{
    throw ({message: "delete ref for test has a problem"});
  }

  }


describe("testing teams utils", () => {
  jest.setTimeout(10000 );

  beforeAll(async () => {
    for (i=0; i<refs.length;i++){
      await create_ref_in_leauge_test(refs[i])
    } 
  });


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
        for (i=0; i<refs.length;i++){
            await delete_ref_in_leauge_test(refs[i]);
        }
        await DButils.pool.close();
    });

});