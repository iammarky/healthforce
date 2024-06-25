export const COMPUTE = {
  TOTAL_FTE: async (start, end, data) => {
    // Get the sum of all FTE
    const sumFunctional = parseFloat(
      data.reduce((acc, item) => acc + parseFloat(item['FTE']), 0),
    ).toFixed(2);

    // Deduct the resigned FTE
    const totalFunctional =
      sumFunctional - parseFloat(await COMPUTE.RESIGNED(start, end, data));

    return parseFloat(totalFunctional).toFixed(2);
  },
  TRAVELERS: async (start, end, data) => {
    // Get all travelers with code 'T'
    const filteredData = data.filter(item => item.Code === 'T');

    // Filter travelers that are within the range that is not resigned
    const filteredResignedData = filteredData.filter(item => {
      const itemStart = new Date(item['Resignation']);
      const rangeEnd = new Date(end);

      return itemStart > rangeEnd;
    });

    // Get the sum of the filtered travelers
    const totalTraveler = filteredResignedData.reduce(
      (sum, item) => sum + item.FTE,
      0,
    );

    return parseFloat(totalTraveler).toFixed(2);
  },
  ORIENTATION: async (start, end, data) => {
    // Filter all orientation that is within the range
    const filteredData = data.filter(item => {
      const itemStart = new Date(item['Start']);
      const itemEnd = new Date(item['Orientation End']);
      const rangeStart = new Date(start);
      const rangeEnd = new Date(end);

      return itemStart <= rangeEnd && itemEnd >= rangeStart;
    });

    // Get the sum of the filtered orientation
    const totalOrientation = filteredData.reduce(
      (acc, item) => acc + parseFloat(item['FTE']),
      0,
    );

    return totalOrientation;
  },
  AWAY: async (start, end, data) => {
    // Filter all away that is within the range
    const filteredData = data.filter(item => {
      const itemStart = new Date(item['Away Start']);
      const itemEnd = new Date(item['Away Return']);
      const rangeStart = new Date(start);
      const rangeEnd = new Date(end);

      return itemStart < rangeEnd && itemEnd > rangeStart;
    });

    // Get the sum of the filtered away
    const totalAway = filteredData.reduce(
      (acc, item) => acc + parseFloat(item['FTE']),
      0,
    );

    return totalAway;
  },
  NON_FUNCTIONAL: async (start, end, data) => {
    // Get the orientation and away
    const orientation = await COMPUTE.ORIENTATION(start, end, data);
    const away = await COMPUTE.AWAY(start, end, data);

    // Add the orientation and away
    const totalNonFunctional = parseFloat(orientation) + parseFloat(away);

    return parseFloat(totalNonFunctional).toFixed(2);
  },
  FUNCTIONAL: async (start, end, data) => {
    // Get the TOTAL_FTE, NOT_YET_STARTED, NON_FUNCTIONAL, TRAVELERS
    const total_fte = await COMPUTE.TOTAL_FTE(start, end, data);
    const not_yet_started = await COMPUTE.NOT_YET_STARTED(start, end, data);
    const non_functional = await COMPUTE.NON_FUNCTIONAL(start, end, data);
    const travelers = await COMPUTE.TRAVELERS(start, end, data);

    // Subtract the NOT_YET_STARTED, NON_FUNCTIONAL, TRAVELERS from TOTAL_FTE
    const totalFunctional =
      parseFloat(total_fte) -
      (parseFloat(not_yet_started) +
        parseFloat(non_functional) +
        parseFloat(travelers));

    return parseFloat(totalFunctional).toFixed(2);
  },
  NOT_YET_STARTED: async (start, end, data) => {
    // Filter all not yet started that is within the range
    const filteredData = data.filter(item => {
      const itemStart = new Date(item['Start']);
      const itemEnd = new Date(item['Start']);
      const rangeStart = new Date(start);
      const rangeEnd = new Date(end);

      return itemStart >= rangeEnd && itemEnd >= rangeStart;
    });

    // Get the sum of the filtered not yet started
    const totalNotYetStarted = filteredData.reduce(
      (acc, item) => acc + parseFloat(item['FTE']),
      0,
    );

    return totalNotYetStarted;
  },
  RESIGNED: async (start, end, data) => {
    const filteredData = data.filter(item => {
      const itemStart = new Date(item['Resignation']);
      const rangeEnd = new Date(end);

      return itemStart <= rangeEnd;
    });

    const totalNotYetStarted = filteredData.reduce(
      (acc, item) => acc + parseFloat(item['FTE']),
      0,
    );

    return totalNotYetStarted;
  },
};
