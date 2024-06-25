const generateDateRanges = (startDate, numRanges) => {
  const dateRanges = [];
  let currentStartDate = new Date(startDate);

  const formatDate = date => {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear().toString().slice(-2);
    return `${month}-${day}-${year}`;
  };

  for (let i = 0; i < numRanges; i++) {
    const endDate = new Date(currentStartDate);
    endDate.setDate(currentStartDate.getDate() + 13); // End date is 13 days after the start date
    dateRanges.push({
      start: formatDate(currentStartDate.toISOString().split('T')[0]), // Format as MM-DD-YY
      end: formatDate(endDate.toISOString().split('T')[0]), // Format as MM-DD-YY
    });
    currentStartDate.setDate(currentStartDate.getDate() + 14); // Increment start date by 14 days
  }

  return dateRanges;
};

export default generateDateRanges;
