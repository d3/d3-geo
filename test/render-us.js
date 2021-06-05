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

const us = JSON.parse(readFileSync("test/data/us-10m.json"));

const path = d3.geoPath()
    .projection(d3[projectionSymbol]().precision(0.1))
    .context(context);

context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);

context.beginPath();
path(topojson.feature(us, us.objects.land));
context.fillStyle = "#000";
context.fill();

context.beginPath();
path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }));
context.lineWidth = 0.5;
context.strokeStyle = "#fff";
context.stroke();

context.beginPath();
path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }));
context.lineWidth = 1;
context.strokeStyle = "#fff";
context.stroke();

canvas.pngStream().pipe(process.stdout);
