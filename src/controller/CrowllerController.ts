import "reflect-metadata";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import Crowller from "../utils/crowller";
import _analyzer from "../utils/analyzer";
import { controller, use, get } from "../decorator";
import { getResponseData } from "../utils/util";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (
  req: BodyRequest,
  res: Response,
  next: NextFunction
): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录!"));
  }
};

const test = (req: BodyRequest, res: Response, next: NextFunction): void => {
  console.log(123);
  next();
};

@controller("/")
class CrowllerController {
  @get("/getData")
  @use(checkLogin)
  @use(test)
  getData(req: BodyRequest, res: Response): void {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = _analyzer.getInstance();
    new Crowller(url, analyzer);
    res.json(getResponseData(true));
  }

  @get("/showData")
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(JSON.parse(result));
    } catch (error) {
      res.json(getResponseData(false, "尚未爬取到内容!"));
    }
  }
}
