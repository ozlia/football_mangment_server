const DButils = require("./DButils");
async function addEvent(match_id, event){
    try{
      await getMatchById(match_id);
      await DButils.execQuery(
        `INSERT INTO events VALUES('${match_id}','${event.date}', '${event.min_in_game}', '${event.event_type}', '${event.description}');` 
      );
    }
    catch(error){
      throw({status: 404, message: "match_id was not found"});
    }
  }


  
async function getMatchEvents(match_ids){
    let promises = []
    match_ids.map(match =>  promises.push(DButils.execQuery(
      `SELECT * FROM events WHERE match_id = '${match}'`
    )));
    let events = await Promise.all(promises); 
    
    return events;
  }

  

function getEventsByMatchId(match_id, events){
    let eventlog = events.find(function(eve){
       if(eve[0]){
         return eve[0].match_id == match_id;
        }
        else return false;
      });
    if (eventlog === undefined){
      return[];
    }
    return eventlog;
  }

exports.addEvent = addEvent;
exports.getMatchEvents = getMatchEvents;  