const formatMessage = Scratch.formatMessage

export const intlMapGen = () => ({
  openChart: formatMessage({id:"openChart",default:"open the chart"}),
  setChartType: formatMessage({id:"setChartType",default:"set this chart's type [TYPE]"}),
  setChartTitle: formatMessage({id:"setChartTitle",default:"set this chart's title [TITLE]"}),
  setAxis: formatMessage({id:"setAxis",default:"set the coordinate axis name X-axis [X] Y-axis [Y]"}),
  addData: formatMessage({id:"addData",default:"input data [DATA] X-axis [X] Y-axis [Y]"}),
  clearChart: formatMessage({id:"clearChart",default:"clear the chart"}),
  closeChart: formatMessage({id:"closeChart",default:"close the chart"}),
})