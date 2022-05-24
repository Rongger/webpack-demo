import "./index.less";
import catImg from "../images/cat.jpg";

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
console.log(dog);
