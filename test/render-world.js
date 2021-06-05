#!/usr/bin/env node

import {readFileSync} from "fs";
import * as topojson from "topojson-client";
import {Canvas} from "canvas";
import * as d3 from "../src/index.js";

const width = 960,
    height = 500,
    projectionName = process.argv[2],
    projectionSymbol = "geo" + projectionName[0].toUpperCase() + projectionName.slice(1);

if (!/^[a-z0-9]+$/i.test(projectionName)) throw new Error;

const canvas = new Canvas(width, height),
    context = canvas.getContext("2d");

const world = JSON.parse(readFileSync("node_modules/world-atlas/world/50m.json")),
    graticule = d3.geoGraticule(),
    outline = {type: "Sphere"};

// switch (projectionName) {
//   case "littrow": outline = graticule.extent([[-90, -60], [90, 60]]).outline(); break;
// }

const projection = (projectionSymbol == 'geoAngleorient30')
  ? d3.geoEquirectangular().clipAngle(90).angle(-30).precision(0.1).fitExtent([[0,0],[width,height]], {type:"Sphere"})
  : d3[projectionSymbol]().precision(0.1);

const path = d3.geoPath()
    .projection(projection)
    .context(context);

context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);
context.save();

// switch (projectionName) {
//   case "armadillo": {
//     context.beginPath();
//     path(outline);
//     context.clip();
//     break;
//   }
// }

context.beginPath();
path(topojson.feature(world, world.objects.land));
context.fillStyle = "#000";
context.fill();

context.beginPath();
path(graticule());
context.strokeStyle = "rgba(119,119,119,0.5)";
context.stroke();

context.restore();

context.beginPath();
path(outline);
context.strokeStyle = "#000";
context.stroke();

canvas.pngStream().pipe(process.stdout);
