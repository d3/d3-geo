import {geoEquirectangular} from "../../src/index.js";
import {assertProjectionEqual} from "./asserts.js";

const pi = Math.PI;

it("equirectangular(point) returns the expected result", () => {
  const equirectangular = geoEquirectangular().translate([0, 0]).scale(1);
  assertProjectionEqual(equirectangular, [   0,   0], [ 0,  0]);
  assertProjectionEqual(equirectangular, [-180,   0], [-pi,  0]);
  assertProjectionEqual(equirectangular, [ 180,   0], [ pi,  0]);
  assertProjectionEqual(equirectangular, [   0,  30], [ 0, -pi / 6]);
  assertProjectionEqual(equirectangular, [   0, -30], [ 0,  pi / 6]);
  assertProjectionEqual(equirectangular, [  30,  30], [ pi / 6, -pi / 6]);
  assertProjectionEqual(equirectangular, [  30, -30], [ pi / 6,  pi / 6]);
  assertProjectionEqual(equirectangular, [ -30,  30], [-pi / 6, -pi / 6]);
  assertProjectionEqual(equirectangular, [ -30, -30], [-pi / 6,  pi / 6]);
});

it("equirectangular.rotate([30, 0])(point) returns the expected result", () => {
  const equirectangular = geoEquirectangular().rotate([30, 0]).translate([0, 0]).scale(1);
  assertProjectionEqual(equirectangular, [   0,   0], [ pi / 6,  0]);
  assertProjectionEqual(equirectangular, [-180,   0], [-5 / 6 * pi,  0]);
  assertProjectionEqual(equirectangular, [ 180,   0], [-5 / 6 * pi,  0]);
  assertProjectionEqual(equirectangular, [   0,  30], [ pi / 6, -pi / 6]);
  assertProjectionEqual(equirectangular, [   0, -30], [ pi / 6,  pi / 6]);
  assertProjectionEqual(equirectangular, [  30,  30], [ pi / 3, -pi / 6]);
  assertProjectionEqual(equirectangular, [  30, -30], [ pi / 3,  pi / 6]);
  assertProjectionEqual(equirectangular, [ -30,  30], [ 0    , -pi / 6]);
  assertProjectionEqual(equirectangular, [ -30, -30], [ 0    ,  pi / 6]);
});

it("equirectangular.rotate([30, 30])(point) returns the expected result", () => {
  const equirectangular = geoEquirectangular().rotate([30, 30]).translate([0, 0]).scale(1);
  assertProjectionEqual(equirectangular, [   0,   0], [ 0.5880026035475674, -0.44783239692893245]);
  assertProjectionEqual(equirectangular, [-180,   0], [-2.5535900500422257,  0.44783239692893245]);
  assertProjectionEqual(equirectangular, [ 180,   0], [-2.5535900500422257,  0.44783239692893245]);
  assertProjectionEqual(equirectangular, [   0,  30], [ 0.8256075561643480, -0.94077119517052080]);
  assertProjectionEqual(equirectangular, [   0, -30], [ 0.4486429615608479,  0.05804529130778048]);
  assertProjectionEqual(equirectangular, [  30,  30], [ 1.4056476493802694, -0.70695172788721770]);
  assertProjectionEqual(equirectangular, [  30, -30], [ 0.8760580505981933,  0.21823451436745955]);
  assertProjectionEqual(equirectangular, [ -30,  30], [ 0.0000000000000000, -1.04719755119659760]);
  assertProjectionEqual(equirectangular, [ -30, -30], [ 0.0000000000000000,  0.00000000000000000]);
});

it("equirectangular.rotate([0, 0, 30])(point) returns the expected result", () => {
  const equirectangular = geoEquirectangular().rotate([0, 0, 30]).translate([0, 0]).scale(1);
  assertProjectionEqual(equirectangular, [   0,   0], [ 0, 0]);
  assertProjectionEqual(equirectangular, [-180,   0], [-pi, 0]);
  assertProjectionEqual(equirectangular, [ 180,   0], [ pi, 0]);
  assertProjectionEqual(equirectangular, [   0,  30], [-0.2810349015028135, -0.44783239692893245]);
  assertProjectionEqual(equirectangular, [   0, -30], [ 0.2810349015028135,  0.44783239692893245]);
  assertProjectionEqual(equirectangular, [  30,  30], [ 0.1651486774146268, -0.70695172788721760]);
  assertProjectionEqual(equirectangular, [  30, -30], [ 0.6947382761967031,  0.21823451436745964]);
  assertProjectionEqual(equirectangular, [ -30,  30], [-0.6947382761967031, -0.21823451436745964]);
  assertProjectionEqual(equirectangular, [ -30, -30], [-0.1651486774146268,  0.70695172788721760]);
});

it("equirectangular.rotate([30, 30, 30])(point) returns the expected result", () => {
  const equirectangular = geoEquirectangular().rotate([30, 30, 30]).translate([0, 0]).scale(1);
  assertProjectionEqual(equirectangular, [   0,   0], [ 0.2810349015028135, -0.67513153293703170]);
  assertProjectionEqual(equirectangular, [-180,   0], [-2.8605577520869800,  0.67513153293703170]);
  assertProjectionEqual(equirectangular, [ 180,   0], [-2.8605577520869800,  0.67513153293703170]);
  assertProjectionEqual(equirectangular, [   0,  30], [-0.0724760059270816, -1.15865677086597720]);
  assertProjectionEqual(equirectangular, [   0, -30], [ 0.4221351552567053, -0.16704161863132252]);
  assertProjectionEqual(equirectangular, [  30,  30], [ 1.2033744221750944, -1.21537512510467320]);
  assertProjectionEqual(equirectangular, [  30, -30], [ 0.8811235701944905, -0.18861638617540410]);
  assertProjectionEqual(equirectangular, [ -30,  30], [-0.7137243789447654, -0.84806207898148100]);
  assertProjectionEqual(equirectangular, [ -30, -30], [ 0,                   0]);
});
