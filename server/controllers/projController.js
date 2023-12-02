import ProjModel from "../models/projModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js";
import Jenkins from "jenkins";
import { exec } from "child_process";

import crypto from "crypto";
import { springTemplate } from "../utils/pipelines/spring.js";
import { nextJSTemplate } from "../utils/pipelines/nextJS.js";

export const createProject = async (req, res) => {
  const { githubUrl, frameWork, fVer, pname } = req.body;

  if (!githubUrl || !frameWork || !fVer || !pname)
    throw new BadRequestError("please provide all fields");

  const proj = await ProjModel.create({
    pid: crypto.randomBytes(4).toString("hex"),
    uid: req.user.uid,
    githubUrl,
    frameWork,
    fVer,
    pname,
    pStatus: "Building",
  });

  var jenkins = new Jenkins({
    baseUrl: "http://darshan:darshan02@localhost:8080",
    crumbIssuer: true,
  });

  var projTemplate = "";
  if (frameWork.toLowerCase() === "spring boot")
    projTemplate = springTemplate(proj.pid, githubUrl);
  if (frameWork.toLowerCase() === "nextjs")
    projTemplate = nextJSTemplate(proj.pid, githubUrl);

  try {
    if (projTemplate !== "") {
      await jenkins.job.create(proj.pid, projTemplate, function (err) {
        if (err) throw err;
      });
      await jenkins.job.build(proj.pid, function (err, data) {
        if (err) throw err;
      });
      res.status(StatusCodes.CREATED).json({ result: proj });
    }
  } catch (error) {
    console.log(error);
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ err: "Something's wrong and it's not your fault" });

  // res.status(StatusCodes.CREATED).json({ result: proj });
};

// ----------------------------------------------------------------------

export const getProjList = async (req, res) => {
  const projs = await ProjModel.find({ uid: req.user.uid }).sort({
    $natural: -1,
  });
  res.status(StatusCodes.OK).json({ result: projs });
};

// ----------------------------------------------------------------------

export const getProj = async (req, res) => {
  const { pid } = req.params;
  const proj = await ProjModel.findOne({ pid, uid: req.user.uid });
  res.status(StatusCodes.OK).json({ result: proj });
};

// ----------------------------------------------------------------------

export const buildProj = async (req, res) => {
  const { pid } = req.body;

  var jenkins = new Jenkins({
    baseUrl: "http://darshan:darshan02@localhost:8080",
    crumbIssuer: true,
  });

  try {
    await jenkins.job.build(pid, function (err, data) {
      if (err) throw err;
    });
    res.status(StatusCodes.OK).json({});
  } catch (e) {}

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ err: "Something's wrong and it's not your fault" });
};

// ----------------------------------------------------------------------

export const getLogs = async (req, res) => {
  const { pid } = req.params;

  var jenkins = new Jenkins({
    baseUrl: "http://darshan:darshan02@localhost:8080",
    crumbIssuer: true,
  });

  var lastBuild = await jenkins.job.get(pid);

  while (lastBuild["lastBuild"] === null) {
    await new Promise((r) => setTimeout(r, 1000));
    lastBuild = await jenkins.job.get(pid);
  }

  var log = jenkins.build.logStream(pid, lastBuild["lastBuild"]["number"]);

  log.on("data", function (text) {
    res.write(text);
  });

  log.on("error", function (err) {
    console.log("error", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ err: "Something's wrong and it's not your fault" });
  });

  log.on("end", function () {
    res.end();
  });
};

// ----------------------------------------------------------------------

export const deleteProj = async (req, res) => {
  const { pid } = req.params;

  var jenkins = new Jenkins({
    baseUrl: "http://darshan:darshan02@localhost:8080",
    crumbIssuer: true,
  });
  try {
    await jenkins.job.destroy(pid, function (err) {
      if (err) throw err;
    });
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ err: "Something's wrong and it's not your fault" });
  }

  const cmdToDelete = `docker stop ${pid}-build-container ${pid}-deploy-container ; docker rm ${pid}-build-container ${pid}-deploy-container ; docker rmi ${pid}-build-image ${pid}-deploy-image `;
  try {
    exec(cmdToDelete, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } catch (e) {}

  await ProjModel.deleteOne({ pid, uid: req.user.uid });

  res.status(StatusCodes.OK).json({});
};

// ----------------------------------------------------------------------
