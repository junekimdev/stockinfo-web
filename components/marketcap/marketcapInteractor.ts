import * as d3 from 'd3';
import { useCallback, useEffect } from 'react';
import { TypeTreemapPrice } from '../../controllers/data/types';
import { useGetPricesSnapshot } from '../../controllers/net/price';

export const useDraw = (svgID: string, max = 100) => {
  const { data } = useGetPricesSnapshot();

  useEffect(() => {
    if (!data?.treemap) return;

    // FHD resolution: 1920x1080
    const width = 1920;
    const height = 1080;

    const color = d3
      .scaleLinear<string>()
      .domain([-5, 0, 5])
      .range(['#00F', '#000', '#F00'])
      .clamp(true);
    const format = d3.format(',d');

    const svg = d3
      .select(`#${svgID}`)
      .attr('xmlns', d3.namespaces.svg)
      .attr('viewBox', [0, 0, width, height]);

    // Clear SVG before redrawing
    svg.selectAll('*').remove();

    const hierarcy = d3
      .hierarchy(data.treemap)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const root = d3
      .treemap<TypeTreemapPrice>()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .padding(1)
      .round(true)(hierarcy);

    const leaf = svg
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    leaf.append('title').text(
      (d, i) =>
        `${d
          .ancestors()
          .reverse()
          .map((d) => d.data.name)
          .join(
            '.',
          )}\nMktCap#${i + 1}\n${format(d.data.close ?? 0)}\n${`${d.data.change_percentage ?? '-'}%`}`,
    );

    leaf
      .append('rect')
      .attr('fill', (d) => color(d.data.change_percentage ?? 0))
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0);

    leaf
      .append('text')
      .attr('fill', 'white')
      .selectAll('tspan')
      .data((d, i) =>
        // Show top (max) only
        i < max
          ? [d.data.name, format(d.data.close ?? 0), `${d.data.change_percentage ?? '-'}%`]
          : '',
      )
      .join('tspan')
      .attr('x', 3)
      .attr('y', (_d, i) => `${i + 1.2}em`)
      .attr('fill-opacity', (_d, i) => (i ? 0.5 : null))
      .text((d) => d);
  }, [svgID, data?.treemap]);
};

export const useDownloadClick = (svgID: string, filename: string) => {
  return useCallback(() => {
    // fetch SVG-rendered image as a blob object
    const svg = document.querySelector(`#${svgID}`);
    if (!svg) return;

    const styleRules = ['width: 100%;', 'font-size: 10px;'];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styleRules.join(' ')));
    svg.insertBefore(style, svg.firstChild); // CSS must be explicitly embedded

    const data = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    });
    style.remove(); // remove temporarily injected CSS

    // convert the blob object to a dedicated URL
    const url = URL.createObjectURL(svgBlob);

    // load the SVG blob to a flesh image object
    const img = new Image();
    img.src = url;
    img.onload = () => {
      // draw the image on an ad-hoc canvas
      // QHD resolution: 2560x1440
      const width = 2560;
      const height = 1440;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const cxt = canvas.getContext('2d');
      if (!cxt) throw Error('failed to get context from canvas');
      cxt.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);

      // trigger a synthetic download operation with a temporary link
      const a = document.createElement('a');
      a.download = filename;
      document.body.appendChild(a);
      a.href = canvas.toDataURL();
      a.click();
      a.remove();
    };
  }, [svgID, filename]);
};
