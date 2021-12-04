---
layout: post
title:  "[ WIP ] C/C++ interviewing questions"
date:   2021-08-20
last_modified_at: 2021-11-23
categories: [C++]
tags: [C++,Interviewing,Puzzles,Questions]
---

C++ questions
1. What is OOP (Encapsulation, Inheritance, Abstraction, Polymorphism)? 4
2. What is the difference between 'class' and 'struct'?
3. How do access modifiers change during inheritance?
4. What is an abstract class in C++?
5. Can we create an instance of an abstract class?
6. How do virtual functions work? 2
7. When virtual function table is created? 3
8. Is it possible to have virtual constructor (why would yes or not)? 2
9. Why do we need virtual destructors? 4
10. Describe the purpose of the `explicit` keyword.
11. What is stack in program and how it is used?
12. What is heap in program and how it is used?
13. When to allocate memory on heap or on stack (pros and cons)?
14. Does heap occupies one block in real memory?
15. Describe the purpose of the `reqister` keyword?
16. How to eliminate problems with management recourses allocated on heap (for example on stack it is managed automatically)?
17. What is RAII (Resource allocation is acquisition)? 5
18. What is smart pointer (how many do you know)? 5
19. Describe the work of the unique_ptr, shared_ptr, weak_ptr.
20. How does thread safety is implemented in shared_ptr? 2
21. Why do shared_ptr and weak_ptr used together (which problems are resolved)?
22. ?Which pattern usually have the problem in the question above (observer)?
23. How can be transfer the ownership of the unique_ptr? 2
24. Can we copy unique_ptr?
25. How can we forbid object copying? 2
26. Advantage of using std::make_shared? 2
27. Describe the purpose of std::enable_shared_from_this (and maybe how it's implemented)?
28. How many STL containers did you work with (name them)? 3
29. std::vector vs std::list?
30. std::array vs std::vector?
31. What is iterator invalidation when working with std::vector?
32. How to eliminate reallocation in vector (reserve)? 2
33. Which associative containers do you know in STL?
34. Difference between std::map and std::unordered_map (and use cases for them) ? 3
35. Complexity of inserting into a std::map / std::unordered_map?
36. What should be implemented in your class to be used as a key of std::map / std::unordered_map (big O of insert, search, ...)? 2
37. Which multithreading functional have you used?
38. What is a deadlock? 3
39. How could deadlocks be resolved (wait with timeout, reorder)?
40. Describe the difference between thread and process. 3
41. What types of IPC do you know? 5
42. Shallow copy vs deep copy.
43. How collisions are resolved in std::unordered_map?
44. How the the binary search algorithm work?
45. What the conditions the data structure must satisfy so the binary search can be applied efficiently?
46. What is rehash and when it happen?
47. How is memory handled between multiple processes?
48. What happens if multiple threads try to read or access memory from the same memory from heap (what can happen)?
49. How do you synchronize 2 threads?
50. Difference between a mutex and a binary semaphore? 2
51. Why can't we use atomics everywhere?  (what is the main drawback when using atomics)? -> flushing cache to memory is slow
52. What is a common way to deadlock 2 threads?
53. If we want to synchronize several processes on same machine, how can we do that?
54. Can we synchronize several processes on 2 different machines, how can we do that?
55. Have you ever used REST API?
56. Difference between REST API and regular http(s) service?
57. What are the principles that makes the service RESTful?
58. Have you ever used gRPC?
59. Have you ever used defined proto files?
60. Have you ever used RabbitMQ?
61. SOLID? 3
62. Describe Observer pattern
63. MVC pattern
64. MVVM pattern
65. What is data binding (resuming MVVM)?
66. Abstract factory design pattern?
67. What kind of synchronization mechanisms do you know? Which one STL implements? 3
68. How many c++ standards do you know? 2
69. When we should use smart pointers?
70. Do smart pointers guarantee no memory leaks?
71. What is move semantics in c++? 4
72. What specific methods should be defined to use move semantics?
73. Difference between rvalue and lvalue? 2
74. Where local variables are stored?
75. Where static variables are stored?
76. What is container class?
77. std::set vs std::vector?
78. std::set vs std::map?
79. What is a time complexity and memory complexity of the algorithm?
80. Which is bettern O(N) or O(1)?
81. Can a destructor be overloaded?
82. What can be overloaded?
83. Can operators be overloaded? 
84. Do you have any experience with Kubernetes and docker?
85. Did you create an image in Docker?
86. Do you have an experience using Python?
87. Experience an CI/CD?
88. Give 5 examples of UB in C++?
89. 1 Unreferencing pointer to dead object
90. 2 Is arithmetics overflow in C++ is UB? (yes)
91. 3 Stack overflow is UB
92. 4
```
std::vector<int> xs = {1, 2, 3};
auto& x = xs[0];
xs.push_back(4);
std::cout << x ; // UB!
```
92. 5 Usage of not inited var is UB
93. Why int is 32 bit both on 32 bit arch and 64 bit arch? (tricky question, just for fun)
94. What is conditional variable, describe its problems? 2
95. How one should write programs in order to escape deadlocks?
96. How exchange data between two processes?
97. Can we allocate 8 GB of ram (alloc(8GB)) ?
98. How to specify that template parameter should be a descendant of some other class?
99.  What does the const member function qualifier do? 2
100. Can virtual function be inlined?
101. Can virtual functions be used in template classes?
102. Can virtual functions be used in structures?
103. Which stl function can be used to check if several sets have intersection?
104. Composition vs aggregation vs association vs inheritance?
105. Equality vs Equivalence? Where it used in STL?
106. What is stack unwinding? 2
107. In some functions it is not recommended to throw exceptions. What are these functions? Why it is not recommended? 3
108. Explain the usage of the `typename` keyword
109. Where should one use `noexcept`? Why? `noexcept` as a part of the function signature?
110. Can `this` be equal to nullptr? When and why that possible?
111. Can a reference be nullptr? Why?
112. Can pure virtual function have a body? Can we call this function? 
113. What types of `new` do you know?
114. What is exception safety, which do you know? 2
115. Types of STL iterators? 3
116. What is internal implementation of the std::deque, std::stack, std::map, std::unordered_map? Which types of iterators are used? Provide O(n) notation for insertion, search and deletion. 
117. enum vs enum class?
118. Describe rules of the member function generation in classes in C++?
119. What is reference collapsing? Where it is used?
120. What is RVO optimization?
121. std::auto_ptr vs std::unique_ptr (obsolete a bit)?
122. Difference between deleters of std::unieque_ptr and std::shared_ptr?
123. How can be implemented reference counting in std::shared_ptr?
124. Why do we need std::make_shared?
125. Why do we need std::weak_ptr? How to create one? How it is implemented? How to use?
126. Is std::shared_ptr threadsafe? 2
127. What is std::future, std::promise? Is it possible to have std::promise<void>?
128. std::thread vs std::async? 2
129. Types of memory models in c++?
130. Why do we need `volatile` keywords? What is stands for? 2
131. Why do we need std::lock? How can STL provide absence of deadlocks?
132. What are memory barriers? Why do we need them? How can we use them in C++?
133. What is the universal reference? 
134. std::move vs std::forward? And why do we need them? 2
135. What is SFINAE? Where is used in STL?
136. What kind of call conventions do you know? Difference between them?
137. What types of programming idioms do you know?
138. What is metaprogramming?
139. How does throw works internally? What kind of code is generated in throw and catch places?
140. What is CRT?
141. Explain initialization and deletion of global, static, threadlocal objects
142. How do mutex, fast mutex, and other primitives work internally?
143. What is lock-free data structures? What are their principles? Pros and cons?
144. What types of polymorphism in C++ do you know?
145. Do all member functions can be virtual?
146. Which types of leaks do you know (memory leak / ...?) ?
147. Can we call virtual functions of other class from destructor?
148. What will happen if code in throws an exception destructor?
149. Which member functions will compiler generate by default?
150. Do all objects could be moved? Can we move an object with std::atomic inside?
151. Performance of different synchronization mechanisms?
152. What is TLS?
153. Which pattern can help you to avoid leaks? (wrapper)
154. How does RAII is implemented in c++?
155. Which design patterns do you know (GoF)? 4
156. How to synchronize different processes? Interprocess communication.
157. What types of network protocols do you know? Difference between them? OSI model? 3
158. TCP vs UDP, HTTPS? 2
159. Do you write Unit tests?
160. What is std::vector, pros and cons?
161. What features in QT do you know (most used)?
162. static_cast vs dynamic_cast, which performance is better, why?
163. Order of constructors and destructors calls while using inheritance?
164. What is diamond problem / which problems can occur while using inheritance?
165. What is inherited constructors?
166. What is delegating constructors?
167. What is a lambda ?
168. What is rule of 5 (or previously rule of 3)?
169. Which properties child process inherits from parent process?
170. What's wrong with Singleton?
171. Singleton in multithread environment?
172. What is cache coherence problem?
173. Why do we need to join threads?
174. Can we join detached thread?
175. Describe the behavior of the conditional variable and the mutex associated with it. Spurious wake up?
176. Mutex on Windows vs mutex on Linux?
177. What it critical section?
178. What is std::async, std::future?
179. How to call C code from C++ and how to call C++ code from C?
180. How many stages of building an executable do you know?
181. What is ABI?
182. What is call convention?
183. What can we do in C++ but cannot in C?
184. What is function overloading in C++? How it works? 
185. Keyword `static` in C++ vs `static` in C?
186. `static` keyword and multithreading in C++11?
187. Lifetime of `static` variables in functions and class member functions?
188. Keyword `extern` in C?
189. What is compilation?
190. What is preprocessing?
191. What is translation unit?
192. What is linking?
193. What types of libraries do you know (static/dynamic), Linux vs Windows?
194. What is ASLR?
195. Compare interpreted and compiled languages. AOT compilation vs JIT compilation
196. Where comes `this` pointer in class member function from?
197. What does mean `const` after member function declaration? Like `void Test::foo() const;`
198. Const pointer to object vs pointer to const object vs const pointer to const object?
199. Where is the virtual function table stored? 2
200. What is `pure virtual method call` error? How can we face it?
201. What is inheritance? Virtual inheritance? Diamond problem? How many instances of parent classes are stored in child? 
202. What kind of casts in c++ do you know? 2
203. What is RTTI? Why do we need it? What will happen if we disable it?
204. What is the relationship between MAC address and IP?
205. How does ARP work?
206. HTTP GET vs POST?
207. What is toolchain? What types of compilers do you know? Have you experienced with crosscompilation?
208. What parts does the running program consist of? memory, program sections?
209. What is member alignment in structures? What is cache alignment?
210. What is SIMD / SSE?
211. What is prefetching into the cache?
212. Which c++ standards do you know? Top features from c++11?
213. What is perfect forwarding?
214. What is data race?
215. What is pimpl, fast pimpl?
216. What is metaprogramming?
217. Service-oriented vs data-oriented architectures?
218. Class vs Struct
219. Change of access modifiers after inheritance
220. Can we create an object of an abstract class?
221. Heap vs stack, usage? When to prefer stack/heap? 2
222. How does the heap work? Is it the solid block of memory? (Virtual memory manager)
223. Keyword `register`?
224. Can pure virtual function have default implementation?
225. Public vs Protected inheritance?
226. Which STl classes implement RAII?
227. `mutable` keyword? 2
228. malloc vs new?
229. What is functor vs lambda?
230. Full vs partial template initialization?
231. What user defined class should have when passing it to STL containers?
232. Time/memory complexity of insertion/search into List/Vector/Map/UnorderedMap?
233. What is std::jthread (C++20)?
234. Thread vs process?
235. Which STL containers do you know?
236. std::vector resize vs reserve?


C++ Practical questions
1. What will be printed and why?
```c++
std::cout << 1u - 2; 
```
2. What is the error in the code below?
```c++
my_struct_t *bar;
/* ... do stuff, including setting bar to point to a defined my_struct_t object ... */
memset(bar, 0, sizeof(bar));
```
3. What is the problem in the code below? What would be an alternate way of implementing this that would avoid the problem?
```c++
size_t sz = buf->size();
while ( --sz >= 0)
{
   /* do something */
}
```
4. Consider the two code snippets below for printing a vector. Is there any advantage of one vs. the other? Explain. (Hint: in any compiler will optimize it out)
```c++
// Option 1
vector vec;
/* ... */
for (auto itr = vec.begin(); itr != vec.end(); itr++) {
   itr->print();
}
```
```c++
// Option 2
vector vec;
/* ... */
for (auto itr = vec.begin(); itr != vec.end(); ++itr) {
   itr->print();
}
```
5. Is it possible to have a recursive inline function?
6. What is the output of the following code? 
```c++
#include <iostream>

class A {
   public:
   A(){}
   ~A(){
      throw 42;
   }
};

int main(){
   try {
      A a;
      throw 32;
   } catch(int a){
      std::cout << a;
   }
   return 0;
}
```
7. What will be printed? Explain.
```c++
#include <iostream>
class Base {
   virtual void method() {std::cout << "from Base" << std::endl;}
public:
   virtual ~Base() {method();}
   void baseMethod() {method();}
};

class A : public Base {
   void method() {std::cout << "from A" <<std::endl;}
public:
   ~A() {method();}
};

int main() {
   Base *base = new A;
   base->baseMethod();
   delete base;
   return 0;
}
```
8. How many iterations will this loop execute?
```c++
unsigned char half_limit  = 150;
for(unsigned char i = 0; i < (2 * half_limit); ++i) {
   // do sth
}
```
9. How to invoke the destructor for pStr?
```c++
MyString *pStr = new MyString("Hello world!");
```
10. How many objects of A does the D class have
```c++
class A {};
class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C, virtual public A {};
```
11. Which of the following types are valid ex [std::logic_error, std::range_error, std::invalid_argument, std::bad_alloc, std::exception]?
```c++
void foo() throw(std::runtime_error) {
   if (/*...*/) throw (ex);
}
```
12. To which type typedef `basic_streambuf<char>` corresponds [streambuf, streambuf<char>, cstreambuf]?
13. What will be the output of the following code?
```c++
struct Test {
    Test()       { std::cout << "d"; }
    Test(int i)  { std::cout << "i"; }
    Test(char c) { std::cout << "c"; }
    Test(long l) { std::cout << "l"; }
    Test(float f){ std::cout << "f"; }
};

int main()
{
    Test t1('c');
    Test t2('c' + 3);
    Test t3(45);
    Test t4(0xFF);
    Test t5(0x1234L);
    Test t6(9999.9f);
    return 0;
}
```
14. Write a method signature which will override given virtual function / or tell will Derived work? 
```c++
struct Test {
   int virtual doMagic() throw(uint8_t, uint64_t, uint32_t);
};
struct Derived {
   int virtual doMagic() throw(uint64_t, uint8_t, uint32_t);
};
``` 
15. Consider following struct `struct Test {int a,b,c;};`.
Can Test be inherited?
Can subclasses of Test access its member variables?
Is it okay to declare as `struct` or should be declared as `class`?
Objects of Test cannot be created because it lacks a ctor?
Are member variables are accessible from outside of the class (for example by dot operator)?
16. What will be the output of the code below?
```c++
int f() {
   int i = 12;
   int &r = i;
   r += r/4;
   int *p = &r;
   *p = r;
   return i;
}
```
17. Which declarations are valid?
```c++
int *t = new int[15];
int t[15];
int t[15] = new int*;
int *t[15];
int **t = new int*[15];
```
18. What will be the output of the following code?
```c++
struct Foo {
   Foo() {std::cout << "Foo";}
};

struct Bar {
   Bar() {std::cout << "Bar";}
};

struct FooToo : virtual Foo {
   FooToo() {std::cout << "FooToo";}
};

struct FooTooBar : virtual FooToo, virtual Bar {
   FooTooBar() {std::cout << "FooTooBar";}
};
```
19. What's wrong with the sample below?
```c++
struct Test {
   int x;
   static void func(int v);
};

void Test::func(int v) {x = v;}
```
20. Which ones are correct and what do the mean?
```c++
void (Test*::func)(int&);
void (Test::*func)(int&);
void (Test::func)(int&);
void (*Test::func)(int&);
void (Test::func*)(int&);
```
21. What's wrong with the code below?
```c++
template<class T1; class T2; class T3>
int Function(T1 t1, T2 t2, T3) {
   return t1 * t2 / t3;
}
```
22. Explain what these methods do?
```c++
std::vector<std::string> vec;
std::fill(vec.begin(), vec.end(), "hello");
std::fill_n(std::back_inserter(vs), 5, "hello");
std::generate(vec.begin(), vec.end(), [] { return "hello"; });
vs = std::vector<std::string>("hello");
```
23. Explain the code below
```c++
extern void
Func(double, char) throw(const char*, RangeErr)
```
24. How to make this code more efficient?
```c++
struct Test {
   char data[10000];
   Test();
   ~Test();
};

struct Another {
   Another() { a = 0;}
   void FillData(Test t);
private:
   int a = 0;
};
```
25. How to get number of characters in std::string (using which function)? 
26. How many standard iostream objects do you know?
27. What is the result of the following program?
```c++
void func() {
    int a = std::rand() % 3;
    if( a == 0)
        throw "str";
    if( a == 1)
        throw 10;
    if( a == 2)
        throw 0.5;
}

int main() {
    try {
        func();
    } catch (...) {
        return 1;
    } catch (int i) {
        return 2;
    } catch (const char* cp) {
        return 3;
    }

    return 0;
}
```
28. Does any commented line has an error?
```c++
template<class T> void foo(T op1, T op2) {
    std::cout << "op1 = " << op1 << std::endl;
    std::cout << "op2 = " << op2 << std::endl;
}

template<class T>
struct sum {
    static void foo (T op1, T op2) {
        std::cout << "sum = " << op2 << std::endl;
    }
};

int main() {
    foo(1, 3);          // Line 1
    foo<int>(1, '3');   // Line 2
    sum::foo(1, 2);     // Line 3
    return 0;
}
```
29. What is the primary purpose of header questions?
30. In C++ there are lots of algo functions that accept function objects as a parameter, how are they called and how can one create example of function object?
31. Where to initialize a non-static class member reference?
32. What header stands for standard C++ I/O to write to a file?
33. What will be the output of the following program?
```c++
void func() throw(float) {
   throw 10.0f;
}
int main() {
   try {
        std::cout << '1';
        func();
        std::cout << '2';
   } catch (...) {
        std::cout << '3';
   }

    return 0;
}
```
34. What will be the output of the following code?
```c++
try {
    throw std::string("4");
} catch (std::string &s) {
    try {
        std::cout << s;
        throw 2;
    } catch (int i){
        std::cout << i;
    } catch (...) {
        throw;
    }
    std::cout << "s" + s;
} catch (...) {
    std::cout << "all";
}
```
35. What is the purpose of the explicit keyword in constructors? 3
36. What does mean `friend` keyword, can you give examples of usage?
37. With regard to enumeration types, which one of the following statements is true?
- When enumerator is used, its value is implicitly converted to an integer when needed.
- An integer can implicitly be converted to an enumeration type.
- Only one identifier in an enum list can have the value zero.
- Enumerators for which no value is explicitly specified have a value of zero.
- Enumeration types must be defined in the body of a class definition.
38. Will this code compile?
```
extern void print(int *ia, int sz);
void print(int *array, int size);
```
39. What's wrong with this code?
```c++
namespace { static int n; }
namespace A {
    namespace { static int n; }
}

using namespace A;
int main() {
    n = 5;
    return 0;
}
```
40. What's wrong with this code?
```c++
void log(std::string message);

class Account
{
public:
   Account(int id);
   virtual ~Account();
   virtual std::string get_name() = 0;
   int get_id();
};

Account::~Account()
{
   log("Destroying: " + get_name());
}
```
41. How many characters are there in this string and why?
```c++
char abc[] = "";
``` 
42. What member function should be defined to make this code work?
```c++
template<class T, class X> class Obj {
    T my_t;
    X my_x;
public:
    Obj(T t, X x): my_t(t), my_x(x){}
    /* put a function here */
};

int main() {
    int iT;
    Obj<int, float> 0(15, 10.375);

    iT = O;
    return 0;
}
``` 
43. How to free allocated memory by this code?
```c++
int* pi = new int[10];
```
44. What's wrong with this code?
```c++
template <typename T>
class Foo
{
   T tVar;
public:
   Foo(T t) : tVar(t) { }
};

class FooDerived : public Foo<std::string> { };

FooDerived fd;
```
45. Write a copy constructor, and how to clone 

```c++
class A {
public:
   A() : a(new int(1)) {}
   ~A() { delete a; }
protected:
   int* a;
};

class B : public A {
public:
   B() : A(), b(new int(2)) {}
   ~B() { delete b; }
protected:
   int* b;
};

void main(void){
   A* a = new B();
   /* new copy of a (but type is B)*/
}
```
46. What's wrong with this code? Any enhancements?
```c++
#include <string>
class Points;
void Mover(const bool& state);
Button(const size_t& height, const std::wstring text);
Button(const Point& point, const std::wstring text);
Frame(const size_t& width, const size_t& height);
const size_t& Width() const;
const size_t& Heigh() const;

```
47. What's wrong with this code?
```c++
void foo() {
   std::vector<std::string> names{"first", "second"};
   // ...
   for (auto name : names) {
      std::cout << names << std::endl;
   }
}
```
48. What's the difference?
```c++
void foo(const std::vector<int>& values) {
   std::vector<int>::const_iterator it = values.begin();
   while (it != values.end()) {
      // it++; vs
      ++it;
   }
}
```
49. What happens here?
```c++
class BaseEx {/* ... */};
class SpecialEx : public BaseEx {/* ... */};
int main() {
   try {
      bool condition;
      /* ... */
      if (condition) {
         throw BaseEx();
      } else {
         throw SpecialEx();
      } 
   }
   catch(const BaseEx& e) {
      /* ... */
   }
   catch(const SpecialEx& e) {
      /* ... */
   }
}
```
50. What happens here?
```c++
struct Test {
   void foo() {
      std::cout << "foo" << std::endl;
   }
   virtual void bar() const {
      std::cout << "bar" << std::endl;
   }
};
int main() {
   Test* test = new Test;
   delete test;
   /* ... */
   test->foo();
   test->bar();
   return 0;
}
```
51. Write an assignment operator and move-constructor
```c++
struct resource {
   int d;
};
class wrapper {
   resource *p;
public:
   wrapper() : p(new resource) {}
   ~wrapper() {delete p;}
};
```
52. What's wrong with this macro?
```c++
#define MULT_BY_KILOBYTE(N) 1024*N
```
53. What's wrong with this code?
```c++
void removeEach3(const vector<int>& v){
   for (vector<int>::iterator i = v.begin(), e = v.end(); i!=e; i++) {
      if (*i == 3) {
         v.erase(i);
      }
   }
}
```
54. Difference between initializations
```c++
   std::vector<int> vec1(5,1);
   std::vector<int> vec2{5};
   std::vector<int> vec3 = {5};
```

Linux questions (this questions could sound strange without context):
1. How to get list of opened sockets in linux
2. Tell about possible situations where you need a list of opened sockets.
3. Where `ps` takes info about processes.
4. What is file descriptor?
5. select vs poll vs epoll?
6. What kind of operations are executed during socket initialization on client/server?
7. What does `accept` function do? Is it blocking? Can we decide whether to be blocking or not?
8. What does `awk` command do?
9. What CLI tools do you use every day?
10. Which networking tools do you know? iperf? tcpdump?

General networking
1. What is proxy server?
2. What is VPN?
3. What is firewall?
4. Encrypting algorithms in networking?
5. What is HMAC? MD5, CRC, SHA?
6. What is AAA (Authentication, Authorization, Accounting)?
7. What is multifactor authentication?
8. Cerberus, SAML?


Algorithmic questions
1. Given an array of N number where max number value is M where M >> N, write a function that takes the array and its size and evaluates it there are any repeating numbers in the array?
2. Consider a linked list, describe an algorithm to check if it has loops?
3. Given std::vector<int> vec{12, 11, 12, 10, 11, 12, 15, 16, 14, 12, 13, 1, 15, 18, 25, 24, 23, 22, 21, 20, 21, 10, 12};. Where index is a day and value is the price of stock. Write an algorithm which finds how much days the price was declining and prints the number of days, day when it started declining and when ended. If price has no change (for example 4 4 4) it isn't declining.
4. You have a linked list `head ---> a->b->c->d->e->f->g`. Reverse it `head ---> g->f->e->d->c->b->a`
```c++
struct Node {
   int date;
   Node* next;
};
Node* Reverse(Node* head) {
   /*...*/
}
```
5. Write an algo which checks whether the string is palindrome?

Open questions
1. We have an IP camera which streams 1MB in size frames, and we have to sync frames to local storage (HDD/SSD/...), why do we need multithreading here?
2. We have information about company employees (id, +some info), we need to frequently search, sometimes delete/add. Which container to use?
3. Imagine following code: a=1, b=2and then call sum and pass it a and b. Somewhere in the memory we allocated a and b, in asm we see jump and when the body of function is executed, how does the function know where to take these a and b? (hint: call convention)
4. Given a computer with 4 GB of RAM, then we start Photoshop and after some time we that it took 8 GB of RAM, how is that possible?
5. Imagine you start designing new design/architecture of classes, how do you do it?
6. Give several examples of Patterns of OOP?
7. We have a singleton class and we wan't to forbid possible ways to create a second instance but allow inheritance, how to do it?
8. We have a string object and want to pass it deep to function, and in current context we don't need it. What should we do?
9. Main concepts of OOP and how it is implemented in c++. 
10. Imagine a situation where we have a remote API server and client says that he can't perform a request to this API server. When I perform request it works. Potential steps to help client.
11. Do you have experience with NAT, which types of NAT you know?
12. What is CMake, do you use it?

Database questions
1. Do you have any experience with databases?
2. What is index in database, which types do you know?
3. You want to clear the table. Difference between `delete` and `truncate`?
4. Can we delete a row if it's referenced by other row by index (question about cascade delete)?
5. What is transaction?
6. What is isolation level?

General questions
1. Which product is perfect for you and why? Choice between lots of technologies to play with or a product where everything is stable?
2. You've found new library which you want to integrate into the project. How would you argument the need of the library, how would you prove the potential value from the integration?
3. Do you have cases while library integration process you understand that it doesn't suit your needs fully? How did you workaround it?
4. Which types of libraries you can't integrate into the procreate solution?
5. How deeply did you work with Linux/Windows/MacOS/...?
6. Tell about the hardest task/issue/case you had tackle? How did you tackle it?
7. Have you done architecture-related work, tell about last ones.
8. Do you have experience in mentoring?
9. What kind of versioning tools do you use?
10. Which instruments for debug do you know?

Soft questions
1. Tell about your ambitions / goals. What do you want to achieve?
2. Why did you decide to quit your current job?
3. What motivates you to work?
4. Tell about your salary expectations (be ready to answer and to bargain).
5. Scrum, Agile, Waterfall?
6. Tell about the most difficult task that you faced? How did you tackled it?
7. Why are you still writing using C++? Because you can easily get more money using JS?:)

Random questions
1. There is only one water lily in the lake. Everyday the number of lilys doubles. On the day 48 the lake was full. Which day there lake was half fulled?