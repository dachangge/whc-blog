## 第一篇： JS数据类型
----
### 1.JS 原始数据类型有哪些？引用数据类型有哪些？

在 JS中， 存在7中原始类型 分别是：
+ boolean
+ null
+ undefined
+ number
+ string
+ symbol
+ bigint

引用数据类型： 对象Object（包含普通对象-Object，数组对象-Array， 正则对象-RegExp， 日期对象-Date， 数学函数-Math， 函数对象-Function）

#### 单独说下 Symbol， 将它理解成独一无二的值

##### 基础用法 

```
    let name = Symbol('whc');
    typeof name; // 'symbol'
    let obj = {};
    obj[name] = 'xhs';
    console.log(obj[name]); // 'xhs'
```

##### APi Symbol.for
这个东西是可共享，在创建的时候会检查全局是否寻在这个key的symbol.如果存在就直接返回这个symbol,如果不存在就会创建，并且在全局注册。symbol的 key 即为参数
```
    let uid = Symbol.for('uid');
    let object = {
        [uid]: 'whc'
    }
    console.log( object[uid]);  // 'whc'
    console.log(uid); //  'Symbol(uid)'

    let uid2 = Symbol.for('uid');

    console.log(uid === uid2);  //true
    console.log(object[uid2]); // 'whc'
    console.log(uid2); // 'Symbol(uid)'
```

##### APi Symbol.keyfor
 获得 symbol 的 key

 ```
    let uid = Symbol.for('uid');
    console.log(Symbol.keyFor(uid)); // 'uid'
    let uid2 = Symbol.for('uid');
    console.log(Symbol.keyFor(uid2))// 'uid'
    let uid3 = Symbol('uid');
    console.log(Symbol.keyFor(uid3)) // undefined
 ```

##### APi Symbol.hasInstance

相当于 `instanceof`

```
    function Xiao(){}
    const x = new Xiao();
    console.log(Xiao[Symbol.hasInstance](x))  // -> true
```

##### Api Symbol.toPrimitive

进行类型转换的时候，对象会进行尝试转换成原始类型，就是通过toPrimitive.这个方法，标准类型的原型上都存在。
```
    const object1 = {
    [Symbol.toPrimitive]: function(hint) {
        if (hint == 'number') {
        return 42;
        }
        return null;
    }
    };

    console.log(+object1);
    // expected output: 42
```


### 说出下面运行的结果， 说出原因
```javaScript
    function test(person){
        person.age = 26
        person = {
            name: 'hzj',
            age: 18
        }
        return person
    }
    const p1 = {
        name: 'fyq',
        age: 19
    }
    const p2 = test(p1)
    console.log(p1) => ?
    console.log(p2) => ?
```
结果： 

```
    p1:   {name: 'fyq', age: 26}
    p2:   {name: 'hzj', age: 18}
```
> 原因： 在函数传参的时候传递的是对象在堆中的内存地址值，test函数中的实参person是p1对象的内存地址，通过调用person.age = 26 确实改变了p1的值，但随后person变成了另一块内存空间的地址，并且在最后将另一块内存空间的地址返回，赋值给了p2。

### 3.null是对象么？ 为什么？

结论： null不是对象

解释： 虽然 typeof null 是 object， 但是这只是JS存在的一个悠久bug。在JS的最初版本中使用的是32位系统，为了性能考虑使用低位存储变量的类型信息，000开头代表是对象然而null表示为全零，所以将它错误的判断为object。

### 4.'1'.toString（） 为什么可以调用

其实在这个语句运行的过程中做了这样几件事
```javaScript
    var s = new Object('1');
    s.toString()
    s = null
```
第一步： 创建Object类实例。注意为什么不是String？ 由于Symbol和Bigint的出现，对它们调用new 都会报错，目前es6规范也不建议用new来创建基本类型的包装类。

第二步： 调用包装类实例对象上的方法。

第三步： 执行完方法立即销毁这个实例。

整个过程体现了`基本包装类型`的性质，而基本包装类型恰恰属于基本数据类型，包括Boolean、Number和String。

> 参考： 《javaScript高级程序设计（第三版）》 P118


### 5.0.1+0.2为什么不等于0.3

0.1和0.2在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。

### 6.如何理解Bigint？

#### 什么是Bigint？

> Bigint是一种新的数据类型，用于当整数值超过Number数据支持的范围时。这种数据类型允许我们安全地对`大整数`执行算数操作，表示高分辨率的时间戳、使用大整数id，等等，都不用再引入第三方库。

#### 为什么需要BigInt?

在JS中，所有的数字都以双精度64位浮点数格式表示，那这样会带来什么问题呢？
其中 第一位 表示 正负值， 2 -12表示指示部分， 13-64 小数部分（共52位，为有效部分）.

```
  1 === 1.0 // ->所有的数字都是浮点数
```
这也表示JS中的Number无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS中的Number类型只能安全表示-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

```
    console.log(9999999999999999999)   // 10000000000000000000
```

同时也会有一定的安全性问题

```
    9007199254740992 === 9007199254740993;    // → true 居然是true!
```

#### 如何创建并使用Bigint

要创建Bigint，只需要在数字后面追加n即可。

```
    console.log(9007199254740995n) // 9007199254740995n
    console.log(9007199254740995) // 9007199254740996
```
另一种创建Bigint的方式是用Bigint的构造函数

```
    Bigint("9007199254740995") // 9007199254740995n
```

简单使用如下:

```
    10n + 20n // 30n
    10n - 20n // -10n
    +10n // TypeError: Cannot convert a BigInt value to a number
    -10n // -10n
    10n * 20n // 200n
    20n / 10n //2n
    23n % 10n // 3n
    10n ** 3n // 1000n
    
    const x = 10n;
    ++x // 11n
    --x //9n
    console.log(typeof x);   //"bigint"
```

#### 值得警惕的点

1.Bigint不支持一元加号运算符， 这可能是某些程序可能依赖于 + 始终生成Number的不变量，或者抛出异常。

2.因为使用隐式转换可能丢失信息，所以不允许Bigint和Number混合操作。当混合使用Bigint和浮点数时，结果值可能无法由Bigint或Number精确表示。

```
    10 + 10n; // -> TypeError
```

3.不能将Bigint传递给Web Api 和内置的js函数，这些函数需要一个Number类型的数字。尝试这样做会报 TypeError。

```
    Math.max(10n, 2n,30n)  // -> TypeError
```

4.当Boolean和Bigint相遇时，Bigint的处理方式和Number类似。只要不是0n，Bigint就视为true。

```
    if(0n){// false

    }
    if(3n){// true

    }
```

5.元素都为Bigint的数组也可以进行sort。

6.Bigint可以正常地进行位运算。 如|、&、<<、>>、和^

#### 浏览器兼容性

caniuse的结果：

![Bigint浏览器兼容性](https://user-gold-cdn.xitu.io/2019/10/22/16df110a69c0ae17?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

其实兼容性并不怎么好，只有 chrome67、firefox、opera这些主流支持， 要想正式成为规范，其实还有很长的路要走。

### 第二篇： JS数据类型之问————检测篇
----

#### 1.typeof 能否正确判断类型

对于原始类型来说，除了null 都能调用typeof 显示正确的类型。

```
    typeof 1;   // 'number'
    typeof '1'; // 'string'
    typeof undefined; // 'undefined'
    typeof true; // 'boolean'
    typeof Symbol() // 'symbol'
    typeof 1n; // 'bigint'
```

对于引用类型来说， 除了函数之外都会显示 'object'

```
    typeof {} // -> 'object'
    typeof [] // -> 'object'
    typeof function() {}  // -> 'function'    
    typeof new Date()  // -> 'object'
    typeof new RegExp() // -> 'object'
```

因此采用采用 `typeof` 判断 引用数据类型 是不准确的， 采用instanceof 会 更好， instanceof 的原理 基于原型链的查询， 只要处于 原型链中， 判断永远为 true

```
    function Person () {}
    const person = new Person();
    person instanceof Person ;  // -> true

    let str1 = 'hello world';
    str1 instanceof String; // -> false

    let str2 = new String('hello world');
    str2 instanceof String; // -> true
```

#### 2.indtanceof能否判断基础类型？

能， 比如下面这种方式

```
    class PrimitiveNumber {
        static [Symbol.hasInstance](x) {
            return typeof x === 'number'
        }
    }
    console.log(111 instanceof PrimitiveNumber);
```
链接： [MDN 上关于 hasInstance 的解释]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance', 'title')

其实就是自定义instanceof行为的一种方式，这里将原有的instanceof方法重定义，换成了typeof，因此能够判断基本数据类型。

#### 3.能不能手动实现一下 instanceof 的 功能?

核心： 原型链的向上查询。

```
    function myInstanceof (left, right){
        if(typeof left !== 'object' || left === null){
            throw new Error("传入的内容必须是引用类型");
        }
        let proto = Object.getPrototypeOf(left);
        while(true){
            if(proto === null){
                return false;
            }
            if(proto === right.prototype){
                return true
            }
            proto = Object.getPrototypeOf(proto);
        }
    }
```

测试： 
```
    console.log(myInstanceof('left', String))  // -> Error
    console.log(new String('left', String))   // -> true
    console.log(new Object(), String)   // -> false
```

#### 4.Object.is 和 === 的区别？

`Obejct.is` 在严格等于的基础上修改了一些特殊情况下的失误，具体来说就是+0 和 -0 ，NaN和NaN；

```
    function is () {
        //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
        if(x === y){
            return x!== 0 || y !== 0 || 1/x === 1/y;
        }
        else {
            //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
            //两个都是NaN的时候返回true
            reutrn x !== x && y !== y;
        }
    }
```


### 3.第三篇：JS数据类型之问————转换篇

#### 1. [] == ![] 结果是什么？ 为什么？

解析：
 == 中， 左右两边需要解析成数字，然后进行比较。
 左侧： [] 转换成数字为 0
 左侧： ![] 先转化成布尔值，[]作为引用类型 先转化成 true， ![]为 false， 再转化成boolean 为0；

0 == 0 ，结果为 true；

#### 2.JS中的类型转换有几种？

JS中，类型转换只有三种：

+ 转换成数字
+ 转换成布尔值
+ 转换成字符串

具体转换规则如下：

> 注意’Boolean、Symbol、Function‘转字符串， 结果显示是 true 转 布尔的例子结果。

![类型转换图](https://user-gold-cdn.xitu.io/2019/10/20/16de9512eaf1158a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1）

#### 3.==和===有什么区别

> ===叫做严格相等，是指：左右两边不仅要值相等，还要类型相等。比如： ’1‘ === 1，结果是false， 因为一个是Number， 一个是 String。

== 不像 === 那样严格， 一般情况下，只要值相等，就返回 true，但 == 还涉及到一些类型转换， 它的转换规则如下：

+ 两边类型是否相等， 相等的话就比较值得大小，例如  1 == 2, false
+ 判断的是否是null 和 undefined， 是的话返回 true
+ 判断的类型是否是String 和 Number， 是的话 把String转化成Number再进行比较
+ 判断其中一方是否是Boolean， 是的话，把Boolean转化成Number再进行比较
+ 如果其中一方是Object，另一方是String、Number、Symbol，把 Object先转换成 String，再进行比较。
+ 如果两个操作数都是对象，则比较它们是不是同一个对象，如果两个操作数都指向同一个对象，则相等操作符返回 true；否则， 返回false
+ 如果一个操作数是对象，另一个操作数不是，则调用对象的valueOf()方法，用得到的基本类型值按照前面的规则进行比较，如果对象没有valueOf()方法，则调用 toString()
+ 如果有一个操作数是NaN，则相等操作符返回 false

```
    console.log({a: 1} == true) ; // -> false
    console.log({a: 1} == '[object object]'); // -> true
    console.log([] == ![]); // -> true
    console.log({} == !{}); // -> false
```


相关链接： [运用例子]('https://blog.csdn.net/magic_xiang/article/details/83686224', 'title')

#### 对象转原始类型是根据什么流程运行的？

对象转原始类型时，会调用内置的[toPrimitive]函数，其逻辑如下：

1. 如果存在Symbol.toPrimitive函数，优先调用并返回。
2. 调用valueOf()，如果返回值为原始类型，返回
2. 调用toString(), 如果返回值为原始类型，返回
4. 如果都没返回原始类型， 会报错

```
    var obj = {
        valueof() {
            reutrn 5;
        },
        toString() {
            return '6';
        },
        [Symbol.toprimitive](){
            reutrn 7
        }
    }
    console.log(obj + 1) // -> 8
```

#### 如何让 a ==1 && a == 2成立？

```
    var a = {
        value: 1,
        valueOf() {
            return this.value++
        }
    }
    console.log( a== 1 && a == 2) // -> true
```

### 第三篇：谈谈你对闭包的理解。

#### 什么是闭包？

> 红宝书（p178）上对于闭包的定义： 闭包是指有权访问另一个函数作用域中的变量的函数。

> MDN 对 闭包的定义： 闭包是指那些能够访问自由变量的函数。（其中自由变量，指在函数中使用的，但既不是函数参数arguments也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。）

#### 闭包产生的原因？

首先要明白作用域的概念， 其实在ES5中只存在2中作用域————全局作用域和函数作用域，`当访问一个变量时，解释器首先会在当前作用域查找标识符，如果没有找到，就去父作用域找，直到找到该变量的标识符或者不在父作用域中，这就是作用域链`,值得注意的是每个子函数都会拷贝上级的作用域，形成一个作用域的链条，比如：

```
    var a = 1;
    function f1() {
        var a = 2;
        function f2(){
            var  a =3;
            console.log(a)
        } 
    }
```
在这段代码中，f1的作用域指向有全局作用域(window)和它本身，而f2的作用域指向全局作用域(window)、f1和它本身。而且作用域是从最底层向上找，直到找到全局作用域window为止，如果全局还没有的话就会报错。就这么简单一件事情！

闭包产生的本质 就是 当前作用域存在指向父级作用域的引用。还是举上面的例子：

```
    function f1() {
        var  a = 2;
        function f2() {
            console.log(a);
        }
        return f2;
    }
    var x = f1();
    x();
```

这里x会拿到父级作用域f1中的变量，输出2.因为在当前作用域中，含有对f2的引用，而f2恰恰引用了window、f1、f2的作用域。

那是不是只有返回了函数才能产生闭包？

回到闭包的本质，只要当前作用域存在指向父级作用域的引用存在即可。

```
    var f2;
    function f1() {
        var a = 1;
        f2 = function(){
            console.log(a);
        }
    }
    f1();
    f2();
```

让f1执行，给f2赋值后，等于说现在f2拥有了window、f1和f3本身这几个作用域的访问权限，还是自底向上查找，最近是在f1中找到了a,因此输出1。

在这里是外面的变量f2存在着父级作用域的引用，因此产生了闭包，形式变了，本质没有改变。

#### 闭包有哪些表现形式？

明白了本质之后，我们来看看，真实的场景：

1. 作为一个函数返回， 上边的例子
2. 作为函数参数传递

```
    var a = 1;
    function f00(){
        var a = 2;
        funtion f003(){
            console.log(a); // -> 2
        }
        f002(f003);
    }
    function f002(fn) {
        fn();
    }
    f00();
```
3. 在定时器、事件监听、ajax请求、跨窗口通信、Web Workers或者热河异步中，只要使用了回调函数，实际上就是在使用闭包。

以下的闭包，保存的仅仅是window和当前作用域。

```
    // 定时器
    setTimeout(function() {
        console.log('111')
    },100)

    // 事件监听
    $('#app').click(function() {
        console.log('DOM click');
    })
```

4. IIFE(立即执行函数表达式)创建闭包，保存了`全局作用域window`和`当前函数的作用域`,因此可以使用全局变量。
```
    var a = 2;
    (function(){
        console.log(a) // -> 2
    })()
```

如何解决下面的循环输出问题？

```
    for(var i = 1; i < 5; i ++){
        setTimeOut(function() {
            console.log(i);
        })
    }
```
为什么会全部输出6？ 如何改进，让它输出 1，2，3，4，5？

因为setTimeout是宏任务， 而JS是单线程 event loop机制， 在主线程上的同步任务执行完成之后才会去执行宏任务，因此循环结束后，setTimeout的回调才会一次执行，但输出的i在回调函数的作用域上没有， 所以往上级找，终于发现了i，此事循环已经结束，i的值为6.

解决方法：

1. 利用 IIFE， 当每次循环执行时，把 i做为参数 传入到定时器中。

```
    for(var i =1; i < 5; i++){
        (function(j){
            setTimeout(function(){
                console.log(j)
            })
        })(i)
    }
```
2. 给定时器传入第三个参数，作为setTimeout的回调的第一个参数

```
    for(var i = 1; i < 5; i ++){
        setTimeout(function(j){
            console.log(j);
        }, 0, i)
    }
```

3. 使用ES6中的let

```
    for(let i = 0; i < 5; i ++){
        setTimeout(function() {
            consle.log(i)
        })
    }
```

let使JS发生革命性的变化，让JS从函数作用域变成了块级作用域，用let后作用域链不复存在。代码的作用域以块级为单位，以上的代码可视为：

```
    // i = 1
    {
        setTimeout(function() {
            console.log(1)
        })
    }
    // i =2
    {
        setTimeout(function() {
            console.log(2)
        })
    }
    // i =3
    {
        setTimeout(function() {
            console.log(3)
        })
    }
    ...
```

因此能输出正确的结果

### 第五篇：谈谈你对原型链的理解。

#### 1.原型对象和构造函数有何关系？

在javaScript中， 当每当创建一个函数数据类型时（函数、类），都会天生自带一个prototype属性，这个属性指向函数的原型对象。

当函数经过new调用之后，这个函数就成了构造函数，返回一个新的实例对象。这个实例对象有一个__proto__,该属性指向构造函数的原型对象。


![原型对象图解](https://user-gold-cdn.xitu.io/2019/10/20/16de955a81892535?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 2.能不能描述下原型链？

JavaScript对象通过Prototype指向父类对象，直到指向Object为止，这样就形成了一个原型指向的链条，即原型链。

![原型链图解](https://user-gold-cdn.xitu.io/2019/10/20/16de955ca89f6091?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

+ 对象的hasOwnProperty用来判断自身对象时候拥有属性
+ 使用in检查对象是否拥有摸个属性时，如果对象中没有，但是原型链中有，也会返回true

### 第六篇： JS如何实现继承？

#### 第一种：借助Call

```
    function Parent1() {
        this.name = 'parent1';
    }

    function Child1() {
        Parent1.call(this);
        this.type = 'child1';
    }
    
    console.log(new Child1());
```

这样写 虽然能拿到父类中的属性值，但是无法拿到父类原型对象中的 方法。

#### 第二种：借助原型链

```
    function Parent2() {
        this.name = 'parent2';
        this.play = [1,2,3];
    }
    function Child2() {
        this.type = 'child2';
    }
    Child2.prototype = new Parent2();
```

这样 看似没有有问， 父类中的属性和方法都能得到，但是存在一个不足。如下：

```
    var c1 = new Child2();
    var c2 = new Child2();
    c1.play.push(4);
    console.log(c2.play)    // -> [1,2,3,4]
```

所有 Child2的实例 共享一个原型对象。


#### 第三种： 将前两种方法结合。

```
    function Parent3() {
        this.name = 'parent3';
        this.play = [1,2,3];
    }

    function Child3() {
        Parent3.call(this);
        this.type = 'child3';
    }
    Child3.prototype = new Parent3();

    var c1 = new Child3();
    var c2 = new Child3();
    c1.play.push(4);
    console.log(c1, c2);  // -> [1,2,3,4], [1,2,3]
```

之前的问题都没了， 产生的新问题是  Parent3 的构造函数 多调用了一次。

#### 第四种： 组合继承的优化1

```
    function Parent4() {
        this.name = 'parent4';
        this.play = [1,2,3];
    }

    function Child4() {
        Parent4.call(this);
        this.type = 'child4';
    }

    Child4.proototype = Parent4.protype;
```

直接将 父类的原型对象赋值给子类的原型对象，父类的构造函数只执行一次，方法和属性都能访问。 问题是输出 Child4的实例对象的时候， 会发现 它的构造函数 __proto__的constructor 指向的是 Parent4；

#### 第五种（最推荐使用）：组合继承优化2

```
    function Parent5() {
        this.name = 'parent5';
        this.paly = [1,2,3];
    }

    function Child5() {
        Parent5.call(this);
        this.type = 'child5';
    }

    Child5.prototype = Object.create(Parent5.prototype);
    Child5.prototype.constructor = Child5; 
```

这是最推荐的实现继承方式，也叫 寄生组合继承。

### 第七篇：函数的arguments为什么不是数组？如何转化成数组？

因为arguments并不拥有数组方法，它是另一种对象类型，只不过属性从0开始排，0、1、2...最后还有callee和length属性。我们把这样的对象类型称为类数组。

常见的类数组还有：

+ 1. 用getElementByTagName/ClassName获得的HTMLcollection
+ 2. 用querySelect 获得的nodeList

这导致很多数组的方法，它们都不能用，所以必要时候要把它们转为数组：

#### 1.Array.prototype.slice.call();

```
    function sum(){
        let args = Array.prototype.slice.call(arguments);
        return args.reduce((sum,cur) => sum + cur);
    }
    sum(2,3)  // -> 5
```

#### 2.Array.from()

```
    function sum() {
        let args = Array.from(arguments);
        return args.reduce((sum,cur) => sum + cur);
    }
    sum(2,3) // -> 5

```

Array.from 同时也可以将 Set\Map 转化成 Array.

#### 3.ES6展开运算符

```
    functino sum() {
        let args = [...arguments];
        return args.reduce((sum,cur) => sum,cur);
    }
    sum(2,3) // -> 5
```

#### 4.Array.prototype.concat.call([], arguments)

```
    functino sum() {
        let args = Array.prototype.caoncat.call([], arguments);
        return args.reduce((sum, cur) => sum + cur);
    }

    sum(2,3)   // -> 5
```

### 第七篇： forEach中return有效果么？如何终端forEach？

在forEach中用return不会立即返回，函数会跳过本次循环继续执行。

```
    let nums = [1,2,3];
    nums.forEach(num => {
        if(num === 1)
            return
        console.log(num);
    })
    // 2,3
```
中断方法：

1. 使用try监听代码块,在需要中断的地方抛出错误

2. 官方推荐方法（替换方法）：用every和some替代forEach函数。every在碰到return false的时候，中止循环。some在碰到return true的时候，中止循环

### 第八篇：JS判断数组中是否包含某个值。

#### 1.array.indexOf

> 此方法判断数组中是否存在某个值， 存在返回该数组元素的小标， 不存在返回 -1；

```
    cnost arr = [1,2,3];
    coonsole.log(arr.indexOf(2));
```

#### 2.array.includes

> 该方法判断数组中是否存在某个值，存在返回 true， 不存在返回 false

```
    let arr = [1,2,3];
    if(arr.includes(2)){
        console.log('存在')
    }else{
        conosole.log('不存在')
    }
```

#### 3.array.find(callback[, thisArg])

> 返回数组中满足条件的第一个元素的值，如果没有，返回undefined

```
    let arr = [1,2,3];
    let item = arr.find(it => it > 1); 
    item == 2; // true
```

#### 4.array.findIndex(callback[, thisArg])

> 返回数组中满足条件的第一个元素的下标，没有，返回-1；

```
    var arr=[1,2,3,4];
    var result = arr.findIndex(item =>{
        return item > 3
    });
    console.log(result); 
```

### 第九章：JS中flat---数组扁平化

对于前端项目开发过程中，偶尔会出现层叠数据结构的数组，我们需要将多层级数组转换成一级数组（即提取嵌套数组最终转换为一级数组），使其内容合并且展开。那么该如何去实现呢？

需求：多维数组 > yi维数组

```
    let arr = [1,[2,[3,[4,5]]],6];
    let str = Json.stringify(arr);
```

#### 1.调用ES的flat方法。   并不会去重

```
    arr = arr.flat(Infinity)
```

#### 2.Replace + split, 操作json 字符串

```
    arr = str.replace(/\[|\]/g, '').split(',')
```

#### 3. replace + JSON.parse ,操作jsono 字符串

```
   var str =  str.replace(/\[|\]/g,'');
   arr = JSON.stringify('[' + str + ']');
```

#### 4. 普通递归

```
    let result = [];
    let fn = function(ary) {
    for(let i = 0; i < ary.length; i++) {
        let item = ary[i];
        if (Array.isArray(ary[i])){
        fn(item);
        } else {
        result.push(item);
        }
    }
    }
```

#### 5.利用reduce函数迭代

```
    function falt(arr){
        return arr.reduce((res, cur) => {
            return res.concat(Array.isArray(cur) ? falt(cur) : cur)
        }, [])
    }

    let ary = [1, 2, [3, 4], [5, [6, 7]]]
    console.log(falt(ary))
```

#### 6. 扩展运算符

```
    while(arr.some(Array.isArray)){
        arr = [].concat(...arg);
    }
```


### 第十篇： JS数组的高阶函数————基础篇


#### 1.什么是高阶函数

简单概念，如下：

> `一个函数`可以接受另一个函数作为参数，胡哦哦这返回一个函数 ， `这种函数`就称为高阶函数。

#### 2.数组中的高阶函数

##### 1. map

+ 1. 参数： 两个参数， 一个是回调函数，一个是回调函数的this值（可选）；其中，回调函数默认传入三个参数，一次为当前元素、当前索引、整个数组。

+ 2. 创建一个新数组，其结果是该数组中的每个元素一次调用回调函数后返回的结果。

+ 3. 对原来的数组没有影响。

```
    let nums = [1,2,3];
    let obj = {val: 5};
    let newNums = nums.map((item, index, array) => {
        return item + index + array[index] + this.val
        // 第一次 1 + 0 + 1 + 5
        // 第二次 2 + 1 + 2 + 5
        // 第三次 3 + 2 + 3 + 5
    }, obj)
    coonsole.log(newNums) // [7,10, 13]
```

#### 2.reduce

+ 参数： 两个参数, 一个为回调函数， 一个是初始值。回调函数中三个默认参数，依次为积累值、当前值、整个数组。

```
    let nums = [1,2,3];
    let sum =nums.reduce((sum, cur, array) => sum + cur, 0);
    console.log(sum); // 6
```

不传默认值会怎么样？

不传默认值， 会以第一个元素为默认值，然后偶从第二个参数开始累计。

#### 3.filter

参数： 一个参数，为回调函数，接受一个默认参数，就是当前元素。这个函数返回一个布尔值，决定元素是否保留。

filter方法返回一个新的函数，这个数组包含参数里所有被保留的项。

```
    let nums = [1,2,3];
    let oddNums = nums.filter(item => item % 2);
    coonsole.log(oddNums);  // [1,3];
```

#### 4.sort

参数： 一个用于比较的函数， 参数 是用来比较的两个元素。

```
    let nums = [2, 3, 1];
    //两个比较的元素分别为a, b
    nums.sort(function(a, b) {
    if(a > b) return 1;
    else if(a < b) return -1;
    else if(a == b) return 0;
    })
```

当比较函数返回值大于0，则 a 在 b 的后面，即a的下标应该比b大。

反之，则 a 在 b 的后面，即 a 的下标比 b 小。

整个过程就完成了一次升序的排列。

当然还有一个需要注意的情况，就是比较函数不传的时候，是如何进行排序的？

> 答案是将数字转换为字符串，然后根据字母unicode值进行升序排序，也就是根据字符串的比较规则进行升序排序。

### 第十一篇：能不能实现数组map方法？

依照 [ecma262草案]('https://tc39.es/ecma262/#sec-array.prototype.map', 'title'),实现的map规则如下

![map草案内容](https://user-gold-cdn.xitu.io/2019/11/3/16e311d99e860405?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

按照 草案内容一步一步 实现map：

```
function map(callbackFn, thisArg) {
    let O = Object(this);
    let len = O.length;
    // 调用的不是数组
    if(this == null){
        throw new TypeError("cannot read property 'map' of null or undefined");
    }
    // callback类型是否正确
    if(Object.prototype.toString.call(callbackFn) === '[object Function]'){
        throw new TypeError(callbackFn + ' is not a function')；
    }
    let T = thisArg || undefined;
    let A = new Array(len);
    for(let k =0; k < len ; k ++){
        let PK = String(k);
        if( PK in O){
            let kValue = O[k];
            let mappedValue = callback.call(T, kValue, k ,O);
            A[k] = mappedValue;
        }
    }
    return A;

}
```

第十二篇： 能不能实现数组reduce方法；

依照 `ecma262草案`, 实现的reduce的规范如下:

![reduce实现方式](https://user-gold-cdn.xitu.io/2019/11/3/16e311ed2bfa8fad?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
    function reduce(callbackFn, initialValue) {
        let O = Object(this);
        let len = ).length;
        if(Object.prototype.toString.call(callback) === '[object Function]'){
            throw new TypeError(callback , 'must be a Function');
        }
        if(len === 0 && initialValue == null){
            throw new TypeError(this, 'must be a Array');
        }
        let k = 0;
        let accumulator = undefined;
        if(initialValue !== null){
            accumulator = initialValue;
        }else{
            find_initial: for(; k < len; k ++){
                if(k in O){
                    accumulator = array(k++);
                    break find_initial;
                }
            }
        }
        for(; k < len; k++){
            if( k in O){
                accumulator = callbackFn.call(undefined, accumulator, O[k], k, O);
            }
        }
        return accumulator;
    }
```

最后给大家奉上V8源码，以供大家检查:

```
    function ArrayReduce(callback, current) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.reduce");

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  return InnerArrayReduce(callback, current, array, length,
                          arguments.length);
}

function InnerArrayReduce(callback, current, array, length, argumentsLength) {
  if (!IS_CALLABLE(callback)) {
    throw %make_type_error(kCalledNonCallable, callback);
  }

  var i = 0;
  find_initial: if (argumentsLength < 2) {
    for (; i < length; i++) {
      if (i in array) {
        current = array[i++];
        break find_initial;
      }
    }
    throw %make_type_error(kReduceNoInitial);
  }

  for (; i < length; i++) {
    if (i in array) {
      var element = array[i];
      current = callback(current, element, i, array);
    }
  }
  return current;
}

```

第十三篇： 能不能实现数组push、pop方法？

参照 ecma262 草案的规定，关于 push 和 pop 的规范如下图所示：

![push草案实现](https://user-gold-cdn.xitu.io/2019/11/3/16e311f4fa483cc2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
    function push(...items){
        let O = Objet(this);
        let len = O.length;
        let argCount = item.length;
        if(len + argCount > 2 ** 53 -1){
            throw new TypeError('The number of array is over the max value restricted!');
        }
        while(items.length){
            let E = items.pop();
            O[len++] = E;
        }
        O.length = len;
        return len;
    }
```

![pop草案方案](https://user-gold-cdn.xitu.io/2019/11/3/16e311fa338c2ecb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
    function pop() {
        let O = Object(this);
        let len = O.length;
        if(len === 0){
            O.length = 0;
            return undefined;
        }else{
            let index = len -1;
            let element = O[0];
            delete O[0];
            O.length = index;
            return element;
        }
    }
```

第十四篇： 能不能实现数组filter方法？

![filter实现方案](https://user-gold-cdn.xitu.io/2019/11/3/16e312629684aafb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
    function filter(callbackFn, thisArg) {
        let O = Object(this);
        let len = O.length;
        if(Object.prototype.toString.call(callbackFn) === '[object Function]'){
            throw new TypeError(callbackFn, 'must be a Function');
        }
        let thisArg = thisArg || undefined;
        let A = [];
        let k =0;
        let to =0;
        while(k < len){
            if(k in O){
                let kVlue = O[k];
                let selected = callbackFn.call(thisArg, kvakue, k ,O);
                if(selected){
                    A[k++] = kValue;
                }
            }
        }
        return A;
    }
```

第十五篇：能不能实现数组Splice方法？

splice 可以说是最受欢迎的数组方法，api灵活，使用方便，梳理下用法。

+ 1.splice(position, count) 表示从position的索引位置开始， 删除count个元素。
+ 2.splice(position, 0, ele1, ele2,...) 表示从positiono的索引位置开始，插入一系列的元素。
+ 3.splice(position, count, ele1, ele2, ...) 表示从从positiono的索引位置开始, 删除count个元素, 插入一系列的元素。
+ 4.返回值为 `被删除元素`组成的 `数组`。

接下来实现这个方法。

首先梳理下实现的思路。

![splice处理流程](https://user-gold-cdn.xitu.io/2019/11/3/16e3121dad3976ea?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 初步实现：

```
    Array.prototype.splice = function(startIndex, deleteCount, ...addElements){
        let argmentsLen = arguments.length;
        let array = Object(this);
        let len = array.length;
        let deleteArr = new Array(deleteCount);

        // 拷贝删除的元素
        sliceDeleteElements(array, startIndex, deleteCount, deleteArr);

        // 移动删除元素后面的元素
        movePostElements(array, startIndex, len, deleteCount, addElements);

        // 插入新元素
        for (let i = 0; i < addElements.length; i++) {
            array[startIndex + i] = addElements[i];
        }
        array.length = len - deleteCount + addElements.length;
        return deleteArr;

    }
```

先拷贝删除元素

```
    function sliceDeleteElements(array, startIndex, deleteCount, deleteArr){
        for(let i =0; i < deleteCount; i ++){
            let index = startIndex + i;
            deleteArr[i] = array[index];
        }
    }
```

然后对删除元素后面的元素进行挪动：

1. 添加的元素和删除的元素个数相等。
2. 添加的元素个数小于删除的元素个数。
3. 添加的元素个数大于删除的元素格式。

当两者相等时：

```
    movePostElements(array,startIndex, len, deleteCount, addElements){
        if(deleteCount == addElements.length){
            return 
        }
    }
```

当添加元素小于删除元素的数量时：

![计算规律1](https://user-gold-cdn.xitu.io/2019/11/3/16e31220582da903?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
    movePostElements(array,startIndex, len, deleteCount, addElements){
        if(deleteCount > addElements.length){
            for(let i = startIndex + deleteCount; i < len; i ++){
                let fromIndex = i;
                let toIndex = fromIndex - (deleteCount - addElements.length)
                if(fromIndex in array){
                    array[toIndex] = array[fromIndex];
                }
            }
            // 缩减array 位置前移后剩余的空格元素
            array.length = len - (deledeCount - addElements.length);
        }
    }
```

当添加元素数量大于删除元素数量时：

![计算规律2](https://user-gold-cdn.xitu.io/2019/11/3/16e3122363235833?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
    movePostElements(array,startIndex, len, deleteCount, addElements){
        if(deleteCount < addElements.length) {
            array.length = len + addElements.length - deleteCount;
            for(let i = startIndex + deleteIndex; i < len; i ++){
                let fromIndex = i;
                let toIndex = i + addElements.length - deleteCount;
                array[toIndex] = array[fromIndex];
            }
        }
    }
```

#### 优化一： 参数的边界情况。

当用户传来非法的 startIndex 和 deleteCount 或者负索引的时候，需要我们做出特殊的处理。

```
    const computedStartIndex = function(startIndex, len){
        // 索引负数 从数组最后的元素开始数起来
        if(startIndex < 0){
            return startIndex + len > 0 ? startIndex + len : 0;
        }
        return startIndex > len ? len : startIndex;
    } 

    const computedDeleteCount = function (startIndex,len, deleteCount, argumentsLen) {
        // 删除数目没有传， 默认删除startIndex后面的所有元素。
        if(arguments.length === 1){
            return len - startIndex;
        }
        // 删除数目过小
        if(deleteCount < 0){
            return 0;
        }
        // 删除数目过大
        if(deleteCount > len -startIndex){
            return len -startIndex;
        } 
        return len - startIndex;
    }

    Array.protootype.splice = function (startIndex, deleteCount, ...addElements) {
        ...
        
        startIndex = computedStartIndex(startIndex, len);
        deleteCount = ComputedDeleteCount(startIndex, len ,deleteCount, argumentsLen);
        
        ...

    }


```

优化二： 数组为密封对象或冻结对象。

什么是密封对象？

> 密封对象是不可扩展的对象，而且已有成员的[[Configurable]]属性被设置为false，这意味着不能添加、删除方法和属性。但是属性值是可以修改的。

什么是冻结对象？

> 冻结对象是最严格的防篡改级别，除了包含密封对象的限制外，还不能修改属性值.

```
    if (Object.isSealed(array) && deleteCount !== addElements.length) {
        throw new TypeError('the object is a sealed object!')
    } else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
        throw new TypeError('the object is a frozen object!')
    }

```

### 第十六篇： 能不能实现数组的sort方法？

实现前 先说下常见的排序方法。

#### 1.冒泡排序

排序思想：

1. 两两比较，如果前者比后者大则交换位置。
2. 每遍历一遍最大的数就会冒泡到最后，确定每轮的最大值放到数组最后位置。
3. 循环 1、2 两步

代码实现：

```
    var arr = [8,99,12312,411241,4123,1,23,45,666];
    for(let i =0; i < arr.length -1; i ++){
        for(let j = 0; j < arr.length -1 -i; j ++){
            if(arr[j] > arr[j+1]){
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }   
    }
    console.log(arr);
```

+ 时间复杂度O（n²）

#### 2.选择排序

算法思想：

1. 找到所有数中最大值下标。
2. 找到的最大值得下标和最后一个位置的数值交换位置，将每次找到的最大值的位置放到最后。
3. 循环1、2两步

代码实现：

```
    let arr = [8,99,12312,411241,4123,1,23,45,666];
    for(let i =0; i < arr.length -1; i ++){
        let max = 0;
        for(let j =1; j < arr.length - i; j++){
            if(arr[j] > arr[max]){
                max = j;
            }
        }
        let temp = arr[max];
        arr[max] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
    console.log(arr);
```

+ 时间复杂度O（n²），但是由于选择排序每轮比较只交换一次，所以实际性能要优于冒泡

#### 3. 直接插入排序

排序思想

1. 从位置1的数值n开始，将前面已经遍历过的数组集合看出数组m，将n往m中插入
2. n插入到集合m中时从后往前比较，如果比n大则往后移一位，如果比较到比n小，则当前位置就是插入n的位置
3. 通过1、2的操作则可以保证每次插入n后m的集合都是排好的序列
4. 循环1、2、3

代码实现：

```
    let arr = [8,99,12312,411241,4123,1,23,45,666];
    for(let i =1; i < arr.length; i ++){
        // i是每次从位置1开始，将每次去做插入的值付给变量temp。 
        let temp = arr[i];
        for(let j = i -1;j >-1; j--){
            if(arr[j] > temp ){
                arr[j + 1] = arr[j];
                // 当前不存在比位置小的数字，判断是否到了第0位索引
                if(j === 0){
                    arr[j] = temp;
                }
            }else{
                arr[j + 1] = temp;
                break;
            }
        }
    }
    console.log(arr);
```

#### 4.二分法排序

+ 二分法排序是插入排序的改进版本，插入排序插入到前方集合中采用的方式是逐个比较，二分法则是采用二分比较。

排序算法： 

1. 从位置1的数值为n，将前面已经遍历过的数值集合看成数组m，则将n往m中插入
2. n插入到集合m中时采用二分法，先比较m中中间的值，如果比n大则继续比较剩下一半集合的中间值，直到比较到拆分的集合中左边或者右边一半没有值为止，则当前中间值得位置即为n插入到m中的位置。
3. 通过1、2的操作则可以保证每次插入n后m的集合都是排好的序列
4. 循环1、2、3操作将集合中所有数值均插入一遍即排序完成


```
    let arr = [8,99,12312,411241,4123,1,23,45,666];
    for(let n =1; n < arr.length; n++ ){
        let temp = arr[n];
        let left = 0, right = arr.length -1;
        let mid;
        while(left < right){
            mid = Math.floor((left + right)/2);
            if(arr[mid] > temp){
                right = mid - 1;
            }else{
                left = mid + 1;
            }
        }
        for(let i = n -1; i >= left; i--){
            if(i >= left){
                arr[i+1] = arr[i];
            }
        }
        if(temp !== arr[n]){
            arr[left] = temp;
        }
    }

    console.log(arr)
```

#### 5.快速排序

快速排序是对冒泡排序的一种改进。它的基本思想是：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一不部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。
整个排序过程只需要三步：

+ 在数据集之中选择一个元素作为’基准‘
+ 所有小于基准的元素，都移动到 ’基准‘ 的左边；所有大于’基准‘的都移动到右边。
+ 多基准两侧的两个子集，不断重复1、2两步，知道所有子集都只剩下一个元素。此时的数组显然已经是升序状态。

算法实现：

```
    let arr = [8,99,12312,411241,4123,1,23,45,666];
    function quickSort(arr){
        if(arr.length <= 1) return arr;
        let left = [],
            right = [],
            baseDot = Math.round(arr.length / 2),
            base = arr.splice(baseDot, 1)[0];
        for(let i=0; i < arr.length; i++){
            if(arr[i] < base){
                left.push(arr[i])
            }else {
                right.push(arr[i])
            }
        }
        return quickSort(left).concat([base], quickSort(right));
    }
    quickSort(arr);
```

再回到正题：

对JS数组的sort方法已经不陌生了，上面总结了它的使用方法。那它的内部是怎么实现的呢？如果我们可以进入它的内部去看一看，理解背后的设计，会使我们的思维和素养得到不错的提升。

sort 方法在 V8 内部相对与其他方法而言是一个比较高深的算法，对于很多边界情况做了反复的优化，但是这里我们不会直接拿源码来干讲。我们会来根据源码的思路，实现一个 跟引擎性能一样的排序算法，并且一步步拆解其中的奥秘。

#### V8 引擎的思路分析

首先梳理下源码中的排序思路：

+ 当 `n < 10` 时，采用`插入排序`
+ 当 `n > 10`时，采用 `三路快速排序
    - 10 < n < 1000,采用中位数 作为哨兵元素
    - n > 1000时，每隔 200~ 215个元素挑选出一个元素，放到一个新数组，然后对它进行排序，找到中间位置的数，将它作为中位数。

在动手以前，我们先来说下这样做的原因。

##### 第一、为什么元素个数少的时候采用插入排序？

虽然插入排序理论上说是O(n^2)的算法，快速排序是一个O(nlogn)级别的算法。但是别忘了，这只是理论上的估算，在实际情况中两者的算法复杂度前面都会有一个系数的，
当 n 足够小的时候，快速排序nlogn的优势会越来越小，倘若插入排序O(n^2)前面的系数足够小，那么就会超过快排。而事实上正是如此，插入排序经过优化以后对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排

因此，对于很小的数据量，应用插入排序是一个非常不错的选择。

##### 第二、为什么要花大力气寻找哨兵元素？

因为`快速排序`的瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或者最大元素，那么进行partition(一边是小于哨兵的元素，另一边是大于哨兵的元素)时，就会有一边是空的，那么这么排下去，递归的层数就达到了n, 而每一层的复杂度是O(n)，因此快排这时候会退化成O(n^2)级别。

这种情况是要尽力避免的！如果来避免？

就是让哨兵元素进可能地处于数组的中间位置，让最大或者最小的情况尽可能少。这时候，你就能理解 V8 里面所做的种种优化了。

接下来，我们来一步步实现的这样的官方排序算法。

#### 插入排序及优化。

最初的插入排序可能是这样写的。

```
    const insertSort = (arr, start = 0, end) => {
        end = end || arr.length;
        for(let i = start; i < end; i++) {
            let j;
            for(j = i; j > start && arr[j - 1] > arr[j]; j --) {
                let temp = arr[j];
                arr[j] = arr[j - 1];
                arr[j - 1] = temp;
            }
        }
        return;
    }
```

看似可以正确的完成排序，但实际上交换元素会有相当大的性能消耗，我们完全可以用变量覆盖的方式来完成，如图所示:

![快速排序动图](https://user-gold-cdn.xitu.io/2019/11/3/16e3124af5479387?imageslim)


```
    const insert = function (arr, start = 0, end) {
        let end = end || arr.length;
        for(let i = start + 1; i < end; i ++){
            let temp = arr[i];
            let j; // 把let变量提前， 不用每次便利都去重新声明一个变量
            for(j =i; j > start && arr[j] > temp; j--){
                arr[j] = srr[j -1];
            }
            arr[j] = temp
        }
    }

```

接下来正式进去sort函数：

#### 寻找哦哨兵元素

sort的骨架大致如下：

```
    Array.prototype.sort = (compareFn) => {
        let array = Object(this);
        let length = length >>> 0;
        return InnerArraySort(array, length, compareFn);
    }

    const InnerArraySort = (array, length, compareFn) => {
        // 比较函数未传入或类型不对，默认值
        if(Object.prototype.toString.call(compareFn) === '[object Function]'){
            compareFn = function(x, y){
                if(x === y) return 0;
                x = String(x);
                y = String(y);
                if(x == y) return 0;
                else return x < y ? -1 : 1;
            }
        }

        const insertSort = () => {
            // ... 插入排序
        }

        const getThirdIndex = (a, from , to) => {
            // 元素个数大于1000时，寻找哨兵元素
        }

        const quickSort = (a, from, to) => {
            // 哨兵位置
            let thirdIndex = 0;
            if(to -from <= 10){
                insertSort(a, from ,to);
                return 
            }
            else if(to -from > 1000){
                thirdIndex = getThirdIndex(a, from , to);
                    
            }
            else{
                // 小于1000直接取中间值
                thirdIndex = from + (10 - from) >> 1;
                    
            }
            // 下面开始快排 
            ...
        }
    }
```

先实现获取哨兵位置的代码：

```
    coonst getThirdIndex = (a, from, to) => {
        let tempArr = [];
        // 递增量，200 - 215 之间，任何正数和 15 做与操作， 0 ~ 15
        let increment = 200 + ((to - from) & 15);
        let j = 0;
        from += 1;

        to -= 1;
        for(let i = from; i < to; i += increment) {
            tmpArr[j] = [i, a[i]];
            j ++
        }
        // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
        tmpArr.sort(function(a, b) {
            return comparefn(a[1], b[1]);
        });
        let thirdIndex = tmpArr[tmpArr.length >> 1][0];
        return thirdIndex;
    }
```

v8 源码

```
function InsertionSort(a, from, to) {
    for (var i = from + 1; i < to; i++) {
        var element = a[i];
        for (var j = i - 1; j >= from; j--) {
            var tmp = a[j];
            var order = comparefn(tmp, element);
            if (order > 0) {
                a[j + 1] = tmp;
            } else {
                break;
            }
        }
        a[j + 1] = element;
    }
};


function QuickSort(a, from, to) {

    var third_index = 0;
    while (true) {
            // Insertion sort is faster for short arrays.
        if (to - from <= 10) {
            InsertionSort(a, from, to);
            return;
        }
        if (to - from > 1000) {
            third_index = GetThirdIndex(a, from, to);
        } else {
            third_index = from + ((to - from) >> 1);
        }
        // Find a pivot as the median of first, last and middle element.
        var v0 = a[from];
        var v1 = a[to - 1];
        var v2 = a[third_index];

        var c01 = comparefn(v0, v1);
        if (c01 > 0) {
            // v1 < v0, so swap them.
            var tmp = v0;
            v0 = v1;
            v1 = tmp;
        } // v0 <= v1.
        var c02 = comparefn(v0, v2);
        if (c02 >= 0) {
            // v2 <= v0 <= v1.
            var tmp = v0;
            v0 = v2;
            v2 = v1;
            v1 = tmp;
        } else {
            // v0 <= v1 && v0 < v2
            var c12 = comparefn(v1, v2);
            if (c12 > 0) {
                // v0 <= v2 < v1
                var tmp = v1;
                v1 = v2;
                v2 = tmp;
            }
        }

        // v0 <= v1 <= v2
        a[from] = v0;
        a[to - 1] = v2;

        var pivot = v1;

        var low_end = from + 1; // Upper bound of elements lower than pivot.
        var high_start = to - 1; // Lower bound of elements greater than pivot.

        a[third_index] = a[low_end];
        a[low_end] = pivot;

        // From low_end to i are elements equal to pivot.
        // From i to high_start are elements that haven't been compared yet.

        partition: for (var i = low_end + 1; i < high_start; i++) {
            var element = a[i];
            var order = comparefn(element, pivot);
            if (order < 0) {
                a[i] = a[low_end];
                a[low_end] = element;
                low_end++;
            } else if (order > 0) {
                do {
                    high_start--;
                    if (high_start == i) break partition;
                    var top_elem = a[high_start];
                    order = comparefn(top_elem, pivot);
                } while (order > 0);

                a[i] = a[high_start];
                a[high_start] = element;
                if (order < 0) {
                    element = a[i];
                    a[i] = a[low_end];
                    a[low_end] = element;
                    low_end++;
                }
            }
        }


        if (to - high_start < low_end - from) {
            QuickSort(a, high_start, to);
            to = low_end;
        } else {
            QuickSort(a, from, low_end);
            from = high_start;
        }
    }
}


```

### 第十七篇：能不能模拟实现一个new的效果？

`new` 被调用后做了三件事：

1. 让实例可以访问到私有属性。
2. 让实例可以访问构造函数原型所以原型链上的属性
3. 如果构造函数的返回值不是引用类型。

```
    function newOperator() {
        let Con = [].unshift.call(arguments);
        if(typeof Con !== 'function'){
            throw new TypeError('newOperator function the first param must be a function');
        }
        let obj = Object.create(Con.prototype);
        let res = Con.call(obj, arguments);

        let isObject = typeof res === 'object' && res !== null;
        let isFunction = typoof res === 'function';
        return isObject || isFunction ? res : obj;
    }
```

### 第十七章：能不能模拟实现一个bind效果？

实现bind之前，我们首先要知道哦它做了什么。

1. 对于普通函数，绑定this指向。
2. 对于构造函数，要保证原函数的原型对象上的属性不能丢

```
    Function.prototype.bind = function(context, ...args) {
        // 类型判断
        if(typeOf this !== 'function'){
            throw new TypeError('Function.prototype.bind -- what is trying to be bound is not a Function');
        }
        let self = this;
        let bound = function () {
            return self.apply(this instanceof bound ? this : content, args);
        }
        bound.prototype = Object.create(self.prototype);
        return bound;
    }
```

### 第十八篇：能不能实现一个 call/apply 函数？


```
    Function.prototype.apply = function(context, ...args){
        if(typeof this !== 'function'){
            throw new TypeError('Function.prototype.apply -- what is trying to be bound is not a Function');
        }
        let context = context || window;
        // 隐式绑定
        context.fn = this;
        let res =eval( 'context.fn(...args)');  
        delete context.fn;
        return res;
    }
```

### 第十九篇：谈谈你对JS中this的理解。

其实JS中的this是一个非常简单的东西，只需要理解它的执行规则就ok。

bind/apply/call 属于显示绑定

主要的隐式绑定场景如下：

1. 全局上下文。
2. 直接调用函数。
3. 对象.方法调用
4. DOM事件绑定
5. new构造函数绑定
6. 箭头函数

#### 1.全局上下文。

全局上下文默认this指向window， 严格模式下指向undefined。

#### 2.直接调用函数

```
    var a = {
        x: function() {
            console.log(123);
        }
    }

    var fn = a.x;
    fn()
```

直接调用fn，this相当于全局上下文的执行。

#### 3.对象.方法调用

```
    a.x();
```

这就是`对象.方法`的情况， this指向这个对象。

#### 4.DOM事件绑定。

onclick和addEventerListener中 this 默认指向绑定事件的元素。

IE比较奇异，使用attachEvent，里面的this默认指向window。

#### 5.new 构造函数绑定

构造函数中的this指向实例对象本身。

#### 6. 箭头函数

箭头函数没有this，因此也不能绑定。里面的this会指向最近的非箭头函数的this，找不到就是window（严格模式下是undefined）

```
    let obj = {
        x: functiono() {
            let fn = () => {
                console.log(this);
            }
            fn();
        }
    }

    obj.x(); // 找到最近的非箭头函数x，x现在绑定着obj, 因此箭头函数中的this是obj
```

> 优先级： new > bind、call、apply> 对象.方法> 直接调用

### 第二十篇： JS中浅拷贝的方法。

#### 重要： 什么是拷贝？

首先来直观的感受下什么是拷贝。

```
    let arr = [1,2,3];
    let newArr = arr;
    newArr[0] = 100;

    console.log(arr);  // [100,2,3]
```

这是直接复制的情况，不设计任何拷贝。当改变newArr的时候，由于是同一个引用， arr的值也跟着变化。

现在进行浅拷贝。

```
    let arr = [1,2,3];
    let newArr = arr.slice();
    newArr[0] = 100;
    coonsole.log(arr);   // [1,2,3]
```

当修改newArr的时候，arr的值并不改变。什么原因?因为这里newArr是arr浅拷贝后的结果，newArr和arr现在引用的已经不是同一块空间啦！


这就是浅拷贝！

但是这又会带来一个潜在的问题:

```
    let arr = [1, 2, {val: 4}];
    let newArr = arr.slice();
    newArr[2].val = 1000;

    console.log(arr);//[ 1, 2, { val: 1000 } ]
```

咦!不是已经不是同一块空间的引用了吗？为什么改变了newArr改变了第二个元素的val值，arr也跟着变了。
这就是浅拷贝的限制所在了。它只能拷贝一层对象。如果有对象的嵌套，那么浅拷贝将无能为力。但幸运的是，深拷贝就是为了解决这个问题而生的，它能
解决无限极的对象嵌套问题，实现彻底的拷贝。当然，这是我们下一篇的重点。 现在先让大家有一个基本的概念。
接下来，我们来研究一下JS中实现浅拷贝到底有多少种方式？

#### 1.手动实现

```
    const shallowClone = (target) => {
        // 引用类型
        if(typeof target === 'object' && target !== null){
            const targetClone = Array.isArray(target) ? [] : {};
            for(let key in target){
                if(target.hasOwnproperty(key)){
                    cloneTarget[key] = target[key];
                }
            }
            return targetClone;
        }else{
            return target;
        }
    }
```

### 2.Object.assign

但是需要注意的是，Object.assign()拷贝的对象的属性的引用，而不是对象本身。

```
    let obj = { name: 'sy', age: 18 };
    const obj2 = Object.assign({}, obj, {name: 'sss'});
    console.log(obj2);//{ name: 'sss', age: 18 }

```

### 3.concat浅拷贝数组

```
    let arr = [1, 2, 3];
    let newArr = arr.concat();
    newArr[1] = 100;
    console.log(arr);//[ 1, 2, 3 ]

```

### 4.slice浅拷贝

开头的例子

### 5. ...展开运算符

```
    let arr = [1, 2, 3];
    let newArr = [...arr];  //跟arr.slice()是一样的效果
```


### 第二十一篇：能不能写一个完整的深拷贝？

上一篇已经解释了什么是浅拷贝，现在来实现一个完整且专业的深拷贝。

### 1.简易版及问题。

利用JSON api。

```
    JSON.parse(JSON.stringify());
```

估计这个api能覆盖大多数的应用场景，没错，谈到深拷贝，我第一个想到的也是它。但是实际上，对于某些严格的场景来说，这个方法是有巨大的坑的。问题如下：

> 1. 无法解决`循环引用`的问题，举个例子：

```
    const a = {val: 2}
    a.target = a;
```

拷贝对象a会出现系统栈溢出，以为出现了`无线递归`的情况。

> 2. 无法拷贝一些特殊的对象类型，如 RegExp 、 Date 、 Set 、 Map 等

> 3. 无法拷贝 `函数` 划重点。

因此这个方法先pass掉，我们重新写一个深拷贝，简易版如下：

```
    const deepClone = (targe) => {
        if(typeof target === 'object' && target !== null){
            let newTarget = Array.isArray(target) ? [] : {};
            for(let key in target) {
                if(target.hasOwnProperty(key)){
                    newTarger[key] = deepClone(target[key]);
                }
            }
            return newTarget;
        }else{
            return target;
        }
    }
```

现在，我们以刚刚发现的三个问题为导向，一步步来完善、优化我们的深拷贝代码。

### 2. 解决循环引用。

问题如下：

```
    var a = {}
    a.target = a;
    deepClone(a); // 报错: RangeError: Maximum call stack size exceeded
```

这就是循环引用。我们怎么来解决这个问题呢？

创建一个Map。记录下已经拷贝过的对象，如果说已经拷贝过，那直接返回它行了.

```
    const isObject = (target) => typeof target === 'object' && target !== null;
    const deepClone = (target, map = new Map()) = > {
        if(map.get(target)){
            return target;
        }
        if(isObject(target)){
            map.set(target, true);
            let res = Array.isArray(target) ? [] : {};
            for(let key in target){
                if(target.hasOwnProperty(key)){
                    res[key] = deepClone(target, map)
                }
            }
            return res;
        }else{
            return target;
        }
    }
```

现在来试一试：

```
    const a = {val:2};
    a.target = a;
    let newA = deepClone(a);
    console.log(newA) //{ val: 2, target: { val: 2, target: [Circular] } }
```

好像是没有问题了, 拷贝也完成了。但还是有一个潜在的坑, 就是map 上的 key 和 map 构成了强引用关系，这是相当危险的。我给你解释一下与之相对的弱引用的概念你就明白了：

> 在计算机程序设计中，弱引用与强引用相对， 是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。 --百度百科

说的有点弱，用大白话解释，被弱引用的对象可以在`任何时候被税收`，而对于强引用来说，只要这个强引用存在，那么对象 `无法被回收`。拿上面的例子来说，map和a一直是强引用关系，在程序结束之前，a所占的内存空间一直不会被释放。

怎么解决这个问题？

很简单，让 map 的 key 和 map 构成弱引用即可。ES6给我们提供了这样的数据结构，它的名字叫`WeakMap`，它是一种特殊的Map, 其中的`键是弱引用`的。其键必须是对象，而值可以是任意的。

稍微改造一下即可:

```
    const deepClone = (target, map = new WeakMap()) => {
        //...
    }
```

#### 3.拷贝特殊对象

4. 拷贝函数

虽然函数也是对象，但是它过于特殊，我们单独把它拿出来拆解。
提到函数，在JS种有两种函数，一种是普通函数，另一种是箭头函数。每个普通函数都是
Function的实例，而箭头函数不是任何类的实例，每次调用都是不一样的引用。那我们只需要
处理普通函数的情况，箭头函数直接返回它本身就好了。
那么如何来区分两者呢？
答案是: 利用原型。箭头函数是不存在原型的。
代码如下:


```
    const handleFunc = (func) => {
    // 箭头函数直接返回自身
    if(!func.prototype) return func;
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    // 分别匹配 函数参数 和 函数体
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if(!body) return null;
    if (param) {
        const paramArr = param[0].split(',');
        return new Function(...paramArr, body[0]);
    } else {
        return new Function(body[0]);
    }
    }

```

直接放完整代码
```
    const getType = obj => Object.prototype.toString.call(obj);

    const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

    const canTraverse = {
    '[object Map]': true,
    '[object Set]': true,
    '[object Array]': true,
    '[object Object]': true,
    '[object Arguments]': true,
    };
    const mapTag = '[object Map]';
    const setTag = '[object Set]';
    const boolTag = '[object Boolean]';
    const numberTag = '[object Number]';
    const stringTag = '[object String]';
    const symbolTag = '[object Symbol]';
    const dateTag = '[object Date]';
    const errorTag = '[object Error]';
    const regexpTag = '[object RegExp]';
    const funcTag = '[object Function]';

    const handleRegExp = (target) => {
        const { source, flags } = target;
        return new target.constructor(source, flags);
    }

    const handleFunc = (func) => {
    // 箭头函数直接返回自身
    if(!func.prototype) return func;
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    // 分别匹配 函数参数 和 函数体
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if(!body) return null;
    if (param) {
        const paramArr = param[0].split(',');
        return new Function(...paramArr, body[0]);
    } else {
        return new Function(body[0]);
    }
    }

    const handleNotTraverse = (target, tag) => {
    const Ctor = target.constructor;
    switch(tag) {
        case boolTag:
        return new Object(Boolean.prototype.valueOf.call(target));
        case numberTag:
        return new Object(Number.prototype.valueOf.call(target));
        case stringTag:
        return new Object(String.prototype.valueOf.call(target));
        case symbolTag:
        return new Object(Symbol.prototype.valueOf.call(target));
        case errorTag: 
        case dateTag:
        return new Ctor(target);
        case regexpTag:
        return handleRegExp(target);
        case funcTag:
        return handleFunc(target);
        default:
        return new Ctor(target);
    }
    }

    const deepClone = (target, map = new WeakMap()) => {
    if(!isObject(target)) 
        return target;
    let type = getType(target);
    let cloneTarget;
    if(!canTraverse[type]) {
        // 处理不能遍历的对象
        return handleNotTraverse(target, type);
    }else {
        // 这波操作相当关键，可以保证对象的原型不丢失！
        let ctor = target.constructor;
        cloneTarget = new ctor();
    }

    if(map.get(target)) 
        return target;
    map.set(target, true);

    if(type === mapTag) {
        //处理Map
        target.forEach((item, key) => {
        cloneTarget.set(deepClone(key, map), deepClone(item, map));
        })
    }
    
    if(type === setTag) {
        //处理Set
        target.forEach(item => {
        cloneTarget.add(deepClone(item, map));
        })
    }

    // 处理数组和对象
    for (let prop in target) {
        if (target.hasOwnProperty(prop)) {
            cloneTarget[prop] = deepClone(target[prop], map);
        }
    }
    return cloneTarget;
    }

```