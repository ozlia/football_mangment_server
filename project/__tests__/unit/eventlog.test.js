const DButils = require("../../routes/utils/DButils");
const eventlog_utils = require("../../routes/utils/eventlog_utils");
var match_id;
var event = {
    date: "12-09-2021",
    description: "Messi got a yellow card",
    event_type: "yellow card",
    min_in_game: "23" };
describe("testing Authenticaion", () => {
    beforeAll(async () => {
      jest.setTimeout(10000);
      await DButils.execQuery(
        `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) VALUES
        ('Eventus','Gueventional','271', '2020-2021','Stages level', '21', 'ref', '12-08-2021', NULL)`
      );
        
        const match = await DButils.execQuery(
          `SELECT match_id FROM match WHERE home_team = 'Eventus'`
          );
          match_id = match[0].match_id;
        
    });

    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM events WHERE match_id = '${match_id}' AND date = '${event.date}' AND description = '${event.description}' AND event_type = '${event.event_type}' AND min_in_game = '${event.min_in_game}'`);
    
        await DButils.execQuery(
        `DELETE FROM match WHERE match_id = '${match_id}'`
      );

      await DButils.pool.close();
    });
  
    test("Add Event to match", async () => {
        try {

            await eventlog_utils.addEvent(match_id,event);
            const inserted_event = await DButils.execQuery(
            `select * from events where match_id = ${match_id} AND date = '${event.date}' AND description = '${event.description}' AND event_type = '${event.event_type}' AND min_in_game = '${event.min_in_game}'`);
            expect(inserted_event.length).toBe(1);
        } catch (error) {
          throw "Add Event operation doesn't work well";
        }
      });

    test("get match event", async () => {
        try {
            let match_ids = [match_id]
            const match_events = await eventlog_utils.getMatchEvents(match_ids);
            const flag = (match_events[0][0].date == event.date && match_events[0][0].description == event.description && match_events[0][0].event_type == event.event_type && match_events[0][0].min_in_game == event.min_in_game && match_events[0][0].match_id == match_id);
            expect(flag).toBe(true);
        } catch (error) {
          throw "get match event operation doesn't work well";
        }
      });

    });
