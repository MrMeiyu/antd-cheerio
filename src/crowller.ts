import path from "path";
import fs from "fs";
import superagent from "superagent";
import DellAnalyzer from "./dellAnalyzer";

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, "../data/course.json");

  private async getRawHtml() {
    const res = await superagent.get(this.url);
    return res.text;
  }

  private writeFile(fileContent: string) {
    fs.writeFileSync(this.filePath, fileContent);
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}

const secret = "secretKey";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const analyzer = DellAnalyzer.getInstance();

new Crowller(url, analyzer);
