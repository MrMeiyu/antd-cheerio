import { RequestHandler } from "express";

// export function use(middleware: RequestHandler) {
//   return function (target: any, key: string) {
//     Reflect.defineMetadata("middleware", middleware, target, key);
//   };
// }
export function use(middleware: RequestHandler) {
  return function (target: any, key: string) {
    const originMiddlewares =
      Reflect.getMetadata("middlewares", target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata("middlewares", originMiddlewares, target, key);
  };
}
