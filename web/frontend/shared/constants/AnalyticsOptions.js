export const DateRangeOptions = [
  { label: 'Last 24 Hours', value: 'hourly' },
  { label: 'Last 7 Days', value: '7-days' },
  { label: 'Last 30 Days', value: '30-days' },
  { label: 'Last 90 Days', value: '90-days' },
  { label: 'Last 365 Days', value: '12-months' },
  { label: 'Last Year', value: 'previous-year' },
  { label: 'Year To Date', value: 'current-year' },
  { label: 'All Time', value: 'all' },
];

export const defaultResults = [
  {
      "key": "5PM",
      "value": 0
  },
  {
      "key": "6PM",
      "value": 0
  },
  {
      "key": "7PM",
      "value": 0
  },
  {
      "key": "8PM",
      "value": 0
  },
  {
      "key": "9PM",
      "value": 0
  },
  {
      "key": "10PM",
      "value": 0
  },
  {
      "key": "11PM",
      "value": 0
  },
  {
      "key": "12AM",
      "value": 0
  },
  {
      "key": "1AM",
      "value": 0
  },
  {
      "key": "2AM",
      "value": 0
  },
  {
      "key": "3AM",
      "value": 0
  },
  {
      "key": "4AM",
      "value": 0
  },
  {
      "key": "5AM",
      "value": 0
  },
  {
      "key": "6AM",
      "value": 0
  },
  {
      "key": "7AM",
      "value": 0
  },
  {
      "key": "8AM",
      "value": 0
  },
  {
      "key": "9AM",
      "value": 0
  },
  {
      "key": "10AM",
      "value": 0
  },
  {
      "key": "11AM",
      "value": 0
  },
  {
      "key": "12PM",
      "value": 0
  },
  {
      "key": "1PM",
      "value": 0
  },
  {
      "key": "2PM",
      "value": 0
  },
  {
      "key": "3PM",
      "value": 0
  },
  {
      "key": "4PM",
      "value": 0
  }
];

export const defaultGraphData = (metric) => {
  const data = {}
  data[`${metric}_stats`] = {
    "results": defaultResults,
  };
  data[`${label}_stats`][`${metric}_total`] = 0;
  return data;
};