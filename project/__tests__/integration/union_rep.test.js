const DButils = require('../../routes/utils/DButils');
const league_utils = require('../../routes/utils/league_utils');
const union_rep_utils = require('../../routes/utils/union_rep_utils');
const guest_utils = require('../../routes/utils/guest_utils');
const integrationHelper = require('../../integrationHelper');

let spies = {};

let tested_match = {
  match_id: -1,
  home_team: 'AaB',
  away_team: 'AGF',
  league: '271',
  season: '2020-2021',
  stage: 'Stages level',
  court: '23',
  referee_name: 'ref',
  date: '2021-09-04T21:52:00',
  score: '2-0',
};

let tested_ref = {
  username: "ref",
  firstname: "ref",
  lastname: "Suban",
  country: "NaorLand",
  password: "Naor",
  email: "Naor@naor.com",
  profile_picture: "Naor.com/imgpath",
};

describe('testing checkMatchCreationConstraints ', () => {
  afterAll(async () => {
    await integrationHelper.clean_test_referee_data();
    await DButils.pool.close();
  });
  beforeAll(async () => {
    jest.setTimeout(30000);
    const user = await integrationHelper.make_test_referee();
    if (!user) {
      throw "this shouldnt happen but it did. something wrong with make_test_referee";
    }
    user_id = user[0].user_id;
    tested_ref.id = user_id;
    user_name = user[0].username;
  });


  beforeEach(() => {
    spies.getTeamByLeagueSpy = jest.spyOn(league_utils, 'getTeamByLeague');

    spies.verifyTeamsFreeOnMatchDateSpy = jest.spyOn(
      union_rep_utils,'verifyTeamsFreeOnMatchDate'
    );

    spies.verifyRefInLeagueSpy = jest.spyOn(union_rep_utils,'verifyRefInLeague');

    spies.getTeamByLeagueSpy.mockReturnValue(Promise.resolve({ venue_id: 3 }));
    spies.verifyTeamsFreeOnMatchDateSpy.mockReturnValue(Promise.resolve(true));
    spies.verifyRefInLeagueSpy.mockReturnValue(Promise.resolve(true));
  });

  test('checkMatchCreationConstraints - fully stubbed', async () => {
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
    expect(spies.getTeamByLeagueSpy).toHaveBeenCalled();
    expect(spies.verifyTeamsFreeOnMatchDateSpy).toHaveBeenCalled();
    expect(spies.verifyRefInLeagueSpy).toHaveBeenCalled();
    expect(matchThatWithstandsConstraints).toBeDefined();
  });


  test('getTeamByLeague stubbed only ', async () => {
    spies.verifyTeamsFreeOnMatchDateSpy.mockRestore(); 
    spies.verifyRefInLeagueSpy.mockRestore(); 
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
      expect(spies.getTeamByLeagueSpy).toHaveBeenCalled();
      expect(spies.verifyTeamsFreeOnMatchDateSpy).not.toHaveBeenCalled();
      expect(spies.verifyRefInLeagueSpy).not.toHaveBeenCalled();
      expect(matchThatWithstandsConstraints).toBeDefined();
  });



  test('checkMatchCreationConstraints - getTeamByLeague and verifyTeamsFreeOnMatchDate stubbed', async () => {
    spies.verifyRefInLeagueSpy.mockRestore();

    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
      expect(spies.getTeamByLeagueSpy).toHaveBeenCalled();
      expect(spies.verifyTeamsFreeOnMatchDateSpy).toHaveBeenCalled();
      expect(spies.verifyRefInLeagueSpy).not.toHaveBeenCalled();
    expect(matchThatWithstandsConstraints).toBeDefined();
  });


  test('checkMatchCreationConstraints - no stubs', async () => {
    spies.getTeamByLeagueSpy.mockRestore(); 
    spies.verifyTeamsFreeOnMatchDateSpy.mockRestore(); 
    spies.verifyRefInLeagueSpy.mockRestore(); 
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
      expect(spies.getTeamByLeagueSpy).not.toHaveBeenCalled();
      expect(spies.verifyTeamsFreeOnMatchDateSpy).not.toHaveBeenCalled();
      expect(spies.verifyRefInLeagueSpy).not.toHaveBeenCalled();
      expect(matchThatWithstandsConstraints).toBeDefined();
  });

  test.skip('checkMatchCreationConstraints - getTeamByLeague and verifyRefInLeague stubbed', async () => {
    spies.verifyTeamsFreeOnMatchDateSpy.mockRestore(); 
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
    expect(spies.getTeamByLeagueSpy).toHaveBeenCalled();
    expect(spies.verifyTeamsFreeOnMatchDateSpy).not.toHaveBeenCalled();
    expect(spies.verifyRefInLeagueSpy).toHaveBeenCalled();
    expect(matchThatWithstandsConstraints).toBeDefined();
  });

  test.skip('checkMatchCreationConstraints - verifyRefInLeague and verifyTeamsFreeOnMatchDate stubbed', async () => {
    spies.getTeamByLeagueSpy.mockRestore(); 
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
      expect(spies.getTeamByLeagueSpy).not.toHaveBeenCalled();
      expect(spies.verifyTeamsFreeOnMatchDateSpy).toHaveBeenCalled();
      expect(spies.verifyRefInLeagueSpy).toHaveBeenCalled();
    expect(matchThatWithstandsConstraints).toBeDefined();
  });





  test.skip('verifyTeamsFreeOnMatchDateSpy stubbed only', async () => {
    spies.getTeamByLeagueSpy.mockRestore(); 
    // spies.verifyTeamsFreeOnMatchDateSpy.mockRestore(); 
    spies.verifyRefInLeagueSpy.mockRestore(); 
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
      expect(spies.getTeamByLeagueSpy).not.toHaveBeenCalled();
      expect(spies.verifyTeamsFreeOnMatchDateSpy).toHaveBeenCalled();
      expect(spies.verifyRefInLeagueSpy).not.toHaveBeenCalled();
      expect(matchThatWithstandsConstraints).toBeDefined();
  });

  test.skip('verifyRefInLeagueSpy stubbed only', async () => {
    spies.getTeamByLeagueSpy.mockRestore(); 
    spies.verifyTeamsFreeOnMatchDateSpy.mockRestore(); 
    // spies.verifyRefInLeagueSpy.mockRestore(); 
    
    const matchThatWithstandsConstraints =
      await union_rep_utils.checkMatchCreationConstraints(
        tested_match.home_team,
        tested_match.away_team,
        tested_match.referee_name,
        tested_match.date
      );
      expect(spies.getTeamByLeagueSpy).not.toHaveBeenCalled();
      expect(spies.verifyTeamsFreeOnMatchDateSpy).not.toHaveBeenCalled();
      expect(spies.verifyRefInLeagueSpy).toHaveBeenCalled();
      expect(matchThatWithstandsConstraints).toBeDefined();
  });







});
