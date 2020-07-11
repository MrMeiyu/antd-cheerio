import "reflect-metadata";
import { Request, Response } from "express";
import { controller, get, post } from "../decorator";
import { getResponseData } from "../utils/util";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller('/')
class LoginController {
  static isLogin(req: BodyRequest) {
    return !!(req.session ? req.session.login : false)
  }

  @post("/login")
  login(req: BodyRequest, res: Response): void {
    const { passWord } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData(false, "已经登录过!"));
    } else {
      if (passWord === "123" && req.session) {
        req.session.login = true;
        res.json(getResponseData(false, "登录成功!"));
      } else {
        res.json(getResponseData(false, "登录失败!"));
      }
    }
  }

  @get("/logout")
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  @get("/")
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);

    if (isLogin) {
      res.send(`
      <html>
        <body>
          <a href="/getData">爬取数据<a/>
          <a href="/showData">展示数据<a/>
          <a href="/logout">退出<a/>
        </body>
      </html>
    `);
    } else {
      res.send(`
          <html>
            <body>
              <form method="post" action="/login">
                <input type="passWord" name="passWord" />
                <button>登陆</button>
              </form>
            </body>
          </html>
        `);
    }
  }
}
