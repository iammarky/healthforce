export const COMPUTE = {
  TOTAL_FTE: async (start, end, data) => {
    // Get the sum of all FTE
    const sumFunctional = data.reduce((acc, item) => {
      const fte = parseFloat(item['FTE']);
      const new_fte = parseFloat(item['FTE Change']);
      const dateOfFTEChange = item['Date of FTE Change'];
      const payPeriodStart = start;
      const payPeriodEnd = end;

      // Check if the FTE change is within the pay period
      if (
        METHOD.checkFTEChange(dateOfFTEChange, payPeriodStart, payPeriodEnd)
      ) {
        return acc + (isNaN(new_fte) ? 0 : new_fte);
      } else {
        return acc + (isNaN(fte) ? 0 : fte);
      }
    }, 0);

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

      return itemStart >= rangeEnd;
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
      const orientationStart = new Date(item['Start']);
      const orientationEnd = new Date(item['Orientation End']);
      const payPeriodStart = new Date(start);
      const payPeriodEnd = new Date(end);

      return METHOD.isInOrientation(
        payPeriodStart,
        payPeriodEnd,
        orientationStart,
        orientationEnd,
      );
    });

    // Get the sum of the filtered orientation
    const totalOrientation = filteredData.reduce((acc, item) => {
      const fte = parseFloat(item['FTE']);
      const new_fte = parseFloat(item['FTE Change']);
      const dateOfFTEChange = item['Date of FTE Change'];
      const payPeriodStart = start;
      const payPeriodEnd = end;

      // Check if the FTE change is within the pay period
      if (
        METHOD.checkFTEChange(dateOfFTEChange, payPeriodStart, payPeriodEnd)
      ) {
        return acc + (isNaN(new_fte) ? 0 : new_fte);
      } else {
        return acc + (isNaN(fte) ? 0 : fte);
      }
    }, 0);

    return totalOrientation;
  },
  AWAY: async (start, end, data) => {
    // Filter all away that is within the range
    const filteredData = data.filter(item => {
      const awayStart = new Date(item['Away Start']);
      const awayEnd = new Date(item['Away Return']);
      const payPeriodStart = new Date(start);
      const payPeriodEnd = new Date(end);

      // if (METHOD.isAway(awayStart, awayEnd, payPeriodStart, payPeriodEnd)) {
      //   console.log(item['First Name'], item['Last Name'], item['FTE']);
      // }

      return METHOD.isAway(awayStart, awayEnd, payPeriodStart, payPeriodEnd);
    });

    const totalAway = filteredData.reduce((acc, item) => {
      const fte = parseFloat(item['FTE']);
      const new_fte = parseFloat(item['FTE Change']);
      const dateOfFTEChange = item['Date of FTE Change'];
      const payPeriodStart = start;
      const payPeriodEnd = end;

      // Check if the FTE change is within the pay period
      if (
        METHOD.checkFTEChange(dateOfFTEChange, payPeriodStart, payPeriodEnd)
      ) {
        return acc + (isNaN(new_fte) ? 0 : new_fte);
      } else {
        return acc + (isNaN(fte) ? 0 : fte);
      }
    }, 0);

    return parseFloat(totalAway).toFixed(2);
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
  PREDICTED_FUNCTIONAL: async (needed = 0, target = 0, projections) => {
    // Iterate through each projection and compute predicted_functional
    projections.forEach((projection, idx) => {
      let accumulatedTurbulence = 0;

      // Accumulate turbulence from all previous projections
      for (let i = 0; i < idx; i++) {
        accumulatedTurbulence += parseFloat(projections[i].turbulence);
      }

      // Compute predicted_functional
      const functional = parseFloat(projection.functional);
      const currentTurbulence = parseFloat(projection.turbulence);
      const predictedFunctional =
        functional - (currentTurbulence + accumulatedTurbulence);
      projection.predicted_functional = predictedFunctional.toFixed(2);

      // Compute predicted_functional + travelers for the current pay period only
      const currentTravelers = parseFloat(projection.travelers);
      const predictedFunctionalTravelers =
        predictedFunctional + currentTravelers;
      projection.predicted_functional_travelers =
        predictedFunctionalTravelers.toFixed(2);

      // Compute predicted_functional + travelers gap (needed) for the current pay period only
      const predictedFunctionalTravelersGap =
        predictedFunctionalTravelers - needed;
      projection.predicted_functional_travelers_gap =
        predictedFunctionalTravelersGap.toFixed(2);

      // Compute predicted_functional_gap_needed for the current pay period only
      const predictedFunctionalGapNeeded = predictedFunctional - needed;
      projection.predicted_functional_gap_needed =
        predictedFunctionalGapNeeded.toFixed(2);

      // Compute predicted_functional_gap_target for the current pay period only
      const predictedFunctionalGapTarget = predictedFunctional - target;
      projection.predicted_functional_gap_target =
        predictedFunctionalGapTarget.toFixed(2);
    });

    return projections;
  },
};

const METHOD = {
  checkFTEChange: (dateOfFTEChange, payPeriodStart, payPeriodEnd) => {
    const fteChangeDate = new Date(dateOfFTEChange);
    const periodStartDate = new Date(payPeriodStart);
    const periodEndDate = new Date(payPeriodEnd);

    const isWithinPayPeriod =
      fteChangeDate >= periodStartDate && fteChangeDate <= periodEndDate;
    const isFirstDayOfPayPeriod =
      fteChangeDate.getTime() === periodStartDate.getTime();
    const isPastPayPeriod = fteChangeDate < periodStartDate;

    return isFirstDayOfPayPeriod || isWithinPayPeriod || isPastPayPeriod;
  },
  isAway: (awayStart, awayEnd, payPeriodStart, payPeriodEnd) => {
    const awayStartDate = new Date(awayStart);
    const awayEndDate = new Date(awayEnd);
    const periodStartDate = new Date(payPeriodStart);
    const periodEndDate = new Date(payPeriodEnd);

    return awayStartDate <= periodEndDate && awayEndDate > periodStartDate;
  },
  isInOrientation: (
    payPeriodStart,
    payPeriodEnd,
    orientationStart,
    orientationEnd,
  ) => {
    // Convert date strings to Date objects
    const PS = new Date(payPeriodStart);
    const PE = new Date(payPeriodEnd);
    const OS = new Date(orientationStart);
    const OE = new Date(orientationEnd);

    // Check if orientation period overlaps with pay period
    return OS <= PE && OE >= PS;
  },
};
