import * as d3 from 'd3';
import { getCandleColor, getDateString, initChart } from '../../controllers/chart';
import * as gType from '../../controllers/data/types';

const draw = (id: string, data: gType.PriceVolume[], marginLeft: number) => {
  if (!data?.length) return;
  const yMin = 0;
  const yMax = d3.max(data, (d) => d.volume) ?? 1;
  const margin = {
    top: 10,
    bottom: 80,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 70;
  const tickYCount = Math.floor(chartHeight / 15);
  const tickYFormat = '~s';

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    showXticks: true,
    tickYCount,
    tickYFormat,
  });

  // Draw bars for high and low
  chart
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(getDateString(d)) ?? 0)
    .attr('y', (d) => y(d.volume))
    .attr('height', (d) => y(0) - y(d.volume))
    .attr('width', x.bandwidth())
    .attr('fill', getCandleColor);
};

export default draw;
