import { complex, ComplexNumber } from './complex';
import SortedArray from 'collections/sorted-array';
import Map from 'collections/map';
import { euclidean2d } from './distance';

const pointEquals = (p0: ComplexNumber, p1: ComplexNumber) => {
	return Math.abs(p0.re - p1.re) < 0.0001 && Math.abs(p0.im - p1.im) < 0.0001;
}

// comparator for sorting point events from left to right (will define the order in the priority queue)
const siteEventComparator = (a: ComplexNumber, b: ComplexNumber) => {
  if (a.im < b.im) {
    return -1;
  } else if (a.im > b.im) {
    return 1;
  } else if (a.re < b.re) {
    return -1;
  } else if (a.re > b.re) {
    return 1;
  }
  return 0;
}

const halfEdgeComparator = (he: HalfEdge, next: HalfEdge) => {
  if (he.ystar > next.ystar) {
    return 1;
  } else if (he.ystar < next.ystar) {
    return -1;
  }

  // unsure about this
  if (he.vertex == null || next.vertex == null) {
    return 0;
  }

  if (he.vertex.re > next.vertex.re) {
    return 1;
  } else if (he.vertex.re < next.vertex.re) {
    return -1;
  }

  return 0;
}

export type Bisector = {
  leftSite: ComplexNumber,
  rightSite: ComplexNumber,
  leftPoint: ComplexNumber | null,
  rightPoint: ComplexNumber | null,
  a: number,
  b: number,
  c: number,
}

export enum HalfEdgeSide {
  Left,
  Right,
}

export type HalfEdge = {
  edge: Bisector,
  side: HalfEdgeSide,
  ystar: number | null,
  vertex: ComplexNumber | null,
  left: HalfEdge | null,
  right: HalfEdge | null,
}

export const bisect = (s1: ComplexNumber, s2: ComplexNumber): Bisector => {
  const newEdge = {
    leftSite: s1,
    rightSite: s2,
    leftSiteIdx: s1,
    rightSiteIdx: s2,
    leftPoint: null,
    rightPoint: null,
    a: -1,
    b: -1,
    c: -1,
  };
  const dx = s2.re - s1.re;
  const dy = s2.im - s1.im;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  newEdge.c = s1.re * dx + s1.im * dy + (dx * dx + dy * dy) * 0.5;

  if (adx > ady) {
    newEdge.a = 1;
    newEdge.b = dy / dx;
    newEdge.c /= dx;
  } else {
    newEdge.a = dx / dy;
    newEdge.b = 1;
    newEdge.c /= dy;
  }
  return newEdge;
};

export const intersect = (el1: HalfEdge, el2: HalfEdge) => {
  const e1 = el1.edge;
  const e2 = el2.edge;
  if (e1 == null || e2 == null) {
    return null;
  }
  if (e1.rightSite == e2.rightSite) {
    return null;
  }
  const d = (e1.a * e2.b) - (e1.b * e2.a);
  if (Math.abs(d) < 1e-10) {
    return null;
  }

  const xint = (e1.c * e2.b - e2.c * e1.b) / d;
  const yint = (e2.c * e1.a - e1.c * e2.a) / d;

  let el = el2;
  let e = e2;
  if ((e1.rightSite.im < e2.rightSite.im) || (e1.rightSite.im === e2.rightSite.im && e1.rightSite.re < e2.rightSite.re)) {
    el = el1;
    e = e1;
  }
  const rightOfSite = (xint >= e.rightSite.re);
  if ((rightOfSite && (el.side == HalfEdgeSide.Left)) || (!rightOfSite && (el.side == HalfEdgeSide.Right))) {
    return null;
  }
  return complex(xint, yint);
};

export const rightOf = (he: HalfEdge, p: ComplexNumber) => {
  const e = he.edge;
  const topsite = e.rightSite;
  const rightOfSite = (p.re > topsite.re);

  if (rightOfSite && (he.side === HalfEdgeSide.Left)) {
    return 1;
  }
  if (!rightOfSite && (he.side === HalfEdgeSide.Right)) {
    return 0;
  }
  let above = false;
  if (e.a == 1) {
    const dyp = p.im - topsite.im;
    const dxp = p.re - topsite.re;
    let fast = false;

    if ((!rightOfSite && (e.b < 0)) ||
      (rightOfSite && (e.b >= 0))) {
      above = fast = (dyp >= e.b * dxp);
    } else {
      above = ((p.re + p.im * e.b) > e.c);
      if (e.b < 0) {
        above = !above;
      }
      if (!above) {
        fast = true;
      }
    }
    if (!fast) {
      const dxs = topsite.re - e.leftSite.re;
      above = (e.b * (dxp * dxp - dyp * dyp)) < (dxs * dyp * (1 + 2 * dxp / dxs + e.b * e.b));
      if (e.b < 0) {
        above = !above;
      }
    }
  } else /* e.b == 1 */ {
    const yl = e.c - e.a * p.re;
    const t1 = p.im - yl;
    const t2 = p.re - topsite.re;
    const t3 = yl - topsite.im;

    above = (t1 * t1) > (t2 * t2 + t3 * t3);
  }
  return he.side == HalfEdgeSide.Left ? above : !above;
};

export const createHalfEdge = (edge: Bisector, side: HalfEdgeSide): HalfEdge => {
  return {
    edge: edge,
    side: side,
    ystar: null,
    vertex: null,
    left: null,
    right: null
  };
};

// doubly linked list for storing edges
export const makeEdgeList = (bottomSite: ComplexNumber) => {
  const leftEnd = createHalfEdge(null, HalfEdgeSide.Left);
  const rightEnd = createHalfEdge(null, HalfEdgeSide.Left);

  leftEnd.right = rightEnd;
  rightEnd.left = leftEnd;

  return {
    leftEnd: () => leftEnd,
    rightEnd: () => rightEnd,

    insert: (lb: HalfEdge, edge: Bisector, side: HalfEdgeSide) => {
      const he = createHalfEdge(edge, side);

      he.left = lb;
      he.right = lb.right;
      lb.right.left = he;
      lb.right = he;

      return he;
    },

    leftBound: (p: ComplexNumber) => {
      let he = leftEnd;
      do {
        he = he.right;
      } while (he != rightEnd && rightOf(he, p));
      return he.left;
    },

    delete: (he: HalfEdge) => {
      he.left.right = he.right;
      he.right.left = he.left;
      he.edge = null;
    },

    leftRegion: (he: HalfEdge) => {
      if (he.edge == null) {
        return bottomSite;
      }
      return he.side == HalfEdgeSide.Left ? he.edge.leftSite : he.edge.rightSite;
    },

    rightRegion: (he: HalfEdge) => {
      if (he.edge == null) {
        return bottomSite;
      }
      return he.side == HalfEdgeSide.Left ? he.edge.rightSite : he.edge.leftSite;
    }
  }
};

const insertVertexEvent = (eventQueue, he: HalfEdge, site: ComplexNumber, offset: number) => {
  he.vertex = site;
  he.ystar = site.im + offset;
  eventQueue.push(he);
};

const endPoint = (edge: Bisector, side: HalfEdgeSide, site: ComplexNumber, result: Bisector[]) => {
  if (side == HalfEdgeSide.Left) {
    edge.leftPoint = site;
    if (edge.rightPoint == null) {
      return;
    }
  } else {
    edge.rightPoint = site;
    if (edge.leftPoint == null) {
      return;
    }
  }
  result.push(edge);
};

export const computeVoronoi = (points: ComplexNumber[], width: number, height: number) => {
  const sites = new SortedArray([...points], null, siteEventComparator);
  const eventQueue = new SortedArray([], null, halfEdgeComparator);
  const result: Bisector[] = [];

  const bottomSite = sites.shift();
  const edgeList = makeEdgeList(bottomSite);

  let newSite = sites.shift();
  let newIntStar = null;
  while (true) {
    if (eventQueue.length > 0) {
      const elem = eventQueue.min();
      newIntStar = complex(elem.vertex.re, elem.ystar);
    }
    if (newSite && (eventQueue.length === 0 || newSite.im < newIntStar.im || (newSite.im == newIntStar.im && newSite.re < newIntStar.re))) { // new site is smallest
      let lbnd = edgeList.leftBound(newSite);
      const rbnd = lbnd.right;
      const bot = edgeList.rightRegion(lbnd);
      const e = bisect(bot, newSite);
      let bisector = edgeList.insert(lbnd, e, HalfEdgeSide.Left);
      let p = intersect(lbnd, bisector);
      if (p) {
        eventQueue.delete(lbnd);
        insertVertexEvent(eventQueue, lbnd, p, euclidean2d(p.re, p.im, newSite.re, newSite.im));
      }
      lbnd = bisector;
      bisector = edgeList.insert(lbnd, e, HalfEdgeSide.Right);
      p = intersect(bisector, rbnd);
      if (p) {
        insertVertexEvent(eventQueue, bisector, p, euclidean2d(p.re, p.im, newSite.re, newSite.im));
      }
      newSite = sites.shift();
    } else if (eventQueue.length > 0) { // intersection is smallest
      const lbnd = eventQueue.shift();
      const rbnd = lbnd.right;
      const llbnd = lbnd.left;
      const rrbnd = rbnd.right;
      let bot = edgeList.leftRegion(lbnd);
      let top = edgeList.rightRegion(rbnd);
      const v = lbnd.vertex;
      endPoint(lbnd.edge, lbnd.side, v, result);
      endPoint(rbnd.edge, rbnd.side, v, result);
      edgeList.delete(lbnd);
      eventQueue.delete(rbnd);
      edgeList.delete(rbnd);
      let pm = HalfEdgeSide.Left;
      if (bot.im > top.im) {
        const temp = bot;
        bot = top;
        top = temp;
        pm = HalfEdgeSide.Right;
      }
      const e = bisect(bot, top);
      const bisector = edgeList.insert(llbnd, e, pm);
      endPoint(e, pm == HalfEdgeSide.Left ? HalfEdgeSide.Right : HalfEdgeSide.Left, v, result);
      let p = intersect(llbnd, bisector);
      if (p) {
        eventQueue.delete(llbnd);
        insertVertexEvent(eventQueue, llbnd, p, euclidean2d(p.re, p.im, bot.re, bot.im));
      }
      p = intersect(bisector, rrbnd);
      if (p) {
        insertVertexEvent(eventQueue, bisector, p, euclidean2d(p.re, p.im, bot.re, bot.im));
      }
    } else {
      break;
    }
  }

  for (let lbnd = edgeList.leftEnd().right; lbnd != edgeList.rightEnd(); lbnd = lbnd.right) {
    result.push(lbnd.edge);
  }

  return postProcessResults(result, width, height);
}

const postProcessResults = (results: Bisector[], width: number, height: number) => {
  // associate edges to each site
  const edgesPerSite = new Map();
  results.forEach(edge => {
    const clipped = clipLine(edge, width, height);
    if (clipped == null) {
      return;
    }
    const p1 = edgesPerSite.get(edge.leftSite) || [];
    p1.push(clipped);
    const p2 = edgesPerSite.get(edge.rightSite) || [];
    p2.push(clipped);

    edgesPerSite.set(edge.leftSite, p1);
    edgesPerSite.set(edge.rightSite, p2);
  });

  const sites = [];

  // reconnect edges into polygons
  edgesPerSite.forEach((eList, site) => {
    const edges = [...eList];
    const firstEdge = edges.shift();
    const polygon = [ firstEdge.p0, firstEdge.p1 ];
    let first = firstEdge.p0;
    let last = firstEdge.p1;
    while(edges.length > 0) {
      let idx = null;
      for (let i = 0; i < edges.length; i++) {
        if (pointEquals(edges[i].p0, edges[i].p1)) { // degenerated edge
          idx = i;
          break;
        } else if (pointEquals(first, edges[i].p0)) {
          first = edges[i].p1;
          polygon.unshift(first);
          idx = i
          break;
        } else if (pointEquals(first, edges[i].p1)) {
          first = edges[i].p0;
          polygon.unshift(first);
          idx = i;
          break;
        } else if (pointEquals(last, edges[i].p0)) {
          last = edges[i].p1;
          polygon.push(last);
          idx = i
          break;
        } else if (pointEquals(last, edges[i].p1)) {
          last = edges[i].p0;
          polygon.push(last);
          idx = i
          break;
        } else if (first.re === 0) {
          if (edges[i].p0.re === 0) {
            polygon.unshift(edges[i].p0);
            polygon.unshift(edges[i].p1);
            first = edges[i].p1;
            idx = i
            break;
          } else if (edges[i].p1.re === 0) {
            polygon.unshift(edges[i].p1);
            polygon.unshift(edges[i].p0);
            first = edges[i].p0;
            idx = i
            break;
          }
        } else if (first.im === 0) {
          if (edges[i].p0.im === 0) {
            polygon.unshift(edges[i].p0);
            polygon.unshift(edges[i].p1);
            first = edges[i].p1;
            idx = i
            break;
          } else if (edges[i].p1.im === 0) {
            polygon.unshift(edges[i].p1);
            polygon.unshift(edges[i].p0);
            first = edges[i].p0;
            idx = i
            break;
          }
        } else if (last.re === 0) {
          if (edges[i].p0.re === 0) {
            polygon.push(edges[i].p0);
            polygon.push(edges[i].p1);
            last = edges[i].p1;
            idx = i
            break;
          } else if (edges[i].p1.re === 0) {
            polygon.push(edges[i].p1);
            polygon.push(edges[i].p0);
            last = edges[i].p0;
            idx = i
            break;
          }
        } else if (last.im === 0) {
          if (edges[i].p0.im === 0) {
            polygon.push(edges[i].p0);
            polygon.push(edges[i].p1);
            last = edges[i].p1;
            idx = i
            break;
          } else if (edges[i].p1.im === 0) {
            polygon.push(edges[i].p1);
            polygon.push(edges[i].p0);
            last = edges[i].p0;
            idx = i
            break;
          }
        } else if (first.re === width) {
          if (edges[i].p0.re === width) {
            polygon.unshift(edges[i].p0);
            polygon.unshift(edges[i].p1);
            first = edges[i].p1;
            idx = i
            break;
          } else if (edges[i].p1.re === width) {
            polygon.unshift(edges[i].p1);
            polygon.unshift(edges[i].p0);
            first = edges[i].p0;
            idx = i
            break;
          }
        } else if (first.im === height) {
          if (edges[i].p0.im === height) {
            polygon.unshift(edges[i].p0);
            polygon.unshift(edges[i].p1);
            first = edges[i].p1;
            idx = i
            break;
          } else if (edges[i].p1.im === height) {
            polygon.unshift(edges[i].p1);
            polygon.unshift(edges[i].p0);
            first = edges[i].p0;
            idx = i
            break;
          }
        }
      }
  
      if (idx == null) {
        // console.log(site, polygon, eList);
        throw new Error('not found');
      }
      edges.splice(idx, 1);
    }
  
    if (pointEquals(polygon[0], polygon[polygon.length - 1])) { // the polygon is bounded
      polygon.pop();
    } else { // we are in a corner
      if (polygon[0].re !== polygon[polygon.length - 1].re && polygon[0].im !== polygon[polygon.length - 1].im) {
        const x = site.re > width/2 ? width : 0;
        const y = site.im > height/2 ? height : 0;
        polygon.push(complex(x, y));
      }
    }

    sites.push({
      edges: eList,
      site,
      polygon,
    });
  });

  return sites;
};

const clipLine = (e: Bisector, width: number, height: number) => {
  const dy = height,
    dx = width,
    d = (dx > dy) ? dx : dy,
    pxmin = - (d - dx) / 2,
    pxmax = width + (d - dx) / 2,
    pymin = - (d - dy) / 2,
    pymax = height + (d - dy) / 2;
  let s1, s2;
  let x1, x2, y1, y2;
  if (e.a == 1 && e.b >= 0) {
    s1 = e.rightPoint;
    s2 = e.leftPoint;
  } else {
    s1 = e.leftPoint;
    s2 = e.rightPoint;
  }
  if (e.a == 1) {
    y1 = pymin;
    if (s1 && s1.im > pymin) {
      y1 = s1.im;
    }
    if (y1 > pymax) {
      return;
    }
    x1 = e.c - e.b * y1;
    y2 = pymax;
    if (s2 && s2.im < pymax) {
      y2 = s2.im;
    }
    if (y2 < pymin) {
      return;
    }
    x2 = e.c - e.b * y2;
    if (((x1 > pxmax) && (x2 > pxmax)) || ((x1 < pxmin) && (x2 < pxmin))) {
      return;
    }
    if (x1 > pxmax) {
      x1 = pxmax;
      y1 = (e.c - x1) / e.b;
    }
    if (x1 < pxmin) {
      x1 = pxmin;
      y1 = (e.c - x1) / e.b;
    }
    if (x2 > pxmax) {
      x2 = pxmax;
      y2 = (e.c - x2) / e.b;
    }
    if (x2 < pxmin) {
      x2 = pxmin;
      y2 = (e.c - x2) / e.b;
    }
  } else {
    x1 = pxmin;
    if (s1 && s1.re > pxmin) {
      x1 = s1.re;
    }
    if (x1 > pxmax) {
      return;
    }
    y1 = e.c - e.a * x1;
    x2 = pxmax;
    if (s2 && s2.re < pxmax) {
      x2 = s2.re;
    }
    if (x2 < pxmin) {
      return;
    }
    y2 = e.c - e.a * x2;
    if (((y1 > pymax) && (y2 > pymax)) || ((y1 < pymin) && (y2 < pymin))) {
      return;
    }
    if (y1 > pymax) {
      y1 = pymax;
      x1 = (e.c - y1) / e.a;
    }
    if (y1 < pymin) {
      y1 = pymin;
      x1 = (e.c - y1) / e.a;
    }
    if (y2 > pymax) {
      y2 = pymax;
      x2 = (e.c - y2) / e.a;
    }
    if (y2 < pymin) {
      y2 = pymin;
      x2 = (e.c - y2) / e.a;
    }
  }
  return { p0: complex(x1, y1), p1: complex(x2, y2) };
}