import "./index.less";
import catImg from "../images/cat.jpg";
import dialog from "dialog";
import moment from "moment";
import "moment/locale/zh-cn"; // 手动引入
import React from "react";
import { createRoot } from "react-dom/client";

// 修改代码，不会造成整个页面的刷新
if (module && module.hot) {
  module.hot.accept();
}

//index.js
class Animal {
  constructor(name) {
    this.name = name;
    this.img = catImg;
  }
  getName() {
    return this.name;
  }
}

const dog = new Animal("dog");
console.log(dog, dialog, moment);

function App() {
  return (
    <div>
      <h3>hello react</h3>
      <img
        src={require("../images/cat.jpg")}
        alt=""
        width="100"
        height="100"
      ></img>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
