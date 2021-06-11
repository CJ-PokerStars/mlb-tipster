const { format } = require("date-fns");

const mapFixturesToSelections = (fixtures) => {
  const selections = [];
  fixtures.forEach((fix) => {
    //Check if home iteam have a .650 pct or higher against any divisio
    const homeDivisionStength = fix.home.stats.divisionRecords.reduce(
      (acc, rec) => {
        if (Number(rec.pct) > 0.6) {
          acc.push(rec.division.name);
          return acc;
        } else {
          return acc;
        }
      },
      []
    );

    const awayDivisionStength = fix.away.stats.divisionRecords.reduce(
      (acc, rec) => {
        if (Number(rec.pct) > 0.6) {
          acc.push(rec.division.name);
          return acc;
        } else {
          return acc;
        }
      },
      []
    );

    homeDivisionStength.forEach((strength) => {
      if (
        strength === fix.away.division &&
        Number(fix.home.probablePitcher.era) <
          Number(fix.away.probablePitcher.era) &&
        fix.home.stats.streak.streakType !== "losses"
      ) {
        selections.push({
          selection: fix.home.name,
          logo: `${fix.home.abbreviation}.png`,
          date: format(new Date(fix.date), "dd-MM-yyyy @ HH:mm"),
        });
      }
    });

    awayDivisionStength.forEach((strength) => {
      if (
        strength === fix.home.division &&
        Number(fix.away.probablePitcher.era) <
          Number(fix.home.probablePitcher.era) &&
        fix.away.stats.streak.streakType !== "losses"
      ) {
        selections.push({
          selection: fix.away.name,
          logo: `${fix.away.abbreviation}.png`,
          date: format(new Date(fix.date), "dd-MM-yyyy @ HH:mm"),
        });
      }
    });
  });

  return selections;
};

module.exports = {
  mapFixturesToSelections,
};
