---
layout: post
title:  "Inheritance, virtual methods in C/C++"
date:   2021-08-20
last_modified_at: 2021-08-20
categories: [C++]
tags: [C++,Inheritance,Virtual Table,Virtual Functions,gdb]
---

<details>
  <summary>Environment</summary>
  <ul>
    <li>OS: macOS Big Sur 11.4</li>
    <li>CPU: Apple M1</li>
    <li>Docker: version 20.10.7, build f0df350</li>
    <li>Docker base image: alpine:3.14</li>
    <li>Compiler : g++ 10.3.1</li>
    <li>Debugger : gdb 10.2</li>
  </ul>
</details>
<br>
<br>

## Set of problems
### 1. Do you see bytes?
```c++
struct Foo {
   void Method() {}
};

struct Bar {
   virtual void VirtualMethod() {}
};

int main()
{
   std::cout << "sizeof(Foo) = " << sizeof(Foo) <<'\n';
   std::cout << "sizeof(Bar) = " << sizeof(Bar) <<'\n';
   /* What will be the output and why? */
}
```
<details>
  <summary>Answer:</summary>

   <details>
     <summary>Output:</summary>
     <pre>sizeof(Foo) = 1
sizeof(Bar) = 8</pre>
   </details>

   <details>
      <summary>Explanation</summary>
      <a>Not implemented</a>
   </details>
</details>
<br>
### 1. Mother == Father?
```c++
struct Mother { /* ... */};
struct Father { /* ... */};
struct Child : Mother, Father {/* ... */};

int main()
{
   Child child;
   void* asMotherRaw = (Mother*)&child;
   void* asFatherRaw = (Father*)&child;
   std::cout << (asMotherRaw == asFatherRaw ? "Same" : "Different") << '\n';;
   /* What will be the output and why? */
}
```
<details>
  <summary>Answer:</summary>

   <details>
     <summary>Output:</summary>
     <pre>Different</pre>
   </details>

   <details>
      <summary>Explanation</summary>
      <a>Not implemented</a>
   </details>
</details>
<br>

### 2. Can something happen without me?
```c++
struct Foo {
   void FirstMethod() { std::cout << "FirstMethod, : " << m_data << "\n"; }
   void SecondMethod() { std::cout << "SecondMethod\n"; }
   int m_data = 10;
};

int main()
{
   Foo* foo = reinterpret_cast<Foo*>(0);
   foo->SecondMethod();
   foo->FirstMethod();
   /* What will happen on these calls and why? */
}
```
<details>
  <summary>Answer:</summary>

   <details>
     <summary>Output:</summary>
     <pre>SecondMethod
Segmentation fault</pre>
   </details>

   <details>
      <summary>Explanation</summary>
      <a>Not implemented</a>
   </details>
</details>
<br>

### 3. Ask mother to do father's work
```c++
struct Mother {
   virtual VirtualMotherMethod() {std::cout << "Mother::VirtualMotherMethod\n";} 
};

struct Father {
   virtual VirtualFatherMethod() {std::cout << "Father::VirtualFatherMethod\n";} 
};

struct Child : Mother, Father {
   virtual VirtualMotherMethod() override {std::cout << "Child::VirtualMotherMethod\n";} 
   virtual VirtualFatherMethod() override {std::cout << "Child::VirtualFatherMethod\n";} 
};

int main()
{
   Child child;
   auto asMother = (Mother*)&child;
   auto motherAsFather = (Father*)asMother;
   motherAsFather->VirtualFatherMethod();
   /* What will be the output and why? */
}
```
<details>
  <summary>Answer:</summary>

   <details>
     <summary>Possible output:</summary>
     <pre>Child::VirtualMotherMethod</pre>
   </details>

   <details>
      <summary>Explanation</summary>
      <a>Not implemented</a>
   </details>
</details>
<br>

### 4. Take care of your child
```c++
struct BadParent {
   BadParent() {std::cout << "BadParent\n";}
   ~BadParent() {std::cout << "~BadParent\n";}
};

struct ChildOfBadParent : BadParent {
   ChildOfBadParent() {std::cout << "ChildOfBadParent\n";}
   ~ChildOfBadParent() {std::cout << "~ChildOfBadParent\n";}
};


struct GoodParent {
   GoodParent() {std::cout << "GoodParent\n";}
   virtual ~GoodParent() {std::cout << "~GoodParent\n";}
};

struct ChildOfGoodParent : GoodParent {
   ChildOfGoodParent() {std::cout << "ChildOfGoodParent\n";}
   ~ChildOfGoodParent() {std::cout << "~ChildOfGoodParent\n";}
};

int main()
{
   {
      /* Bad parent */
      ChildOfBadParent* child = new ChildOfBadParent;
      delete child;
      BadParent* parent= new ChildOfBadParent;
      delete parent;
      std::cout << '\n';
      /* What will be the output and why? */

   }
   {
      /* Good parent */
      ChildOfGoodParent* child = new ChildOfGoodParent;
      delete child;
      GoodParent* parent = new ChildOfGoodParent;
      delete parent;
      /* What will be the output and why? */
   }
}
```
<details>
  <summary>Answer:</summary>

   <details>
     <summary>Output:</summary>
     <pre>BadParent
ChildOfBadParent
~ChildOfBadParent
~BadParent
BadParent
ChildOfBadParent
~BadParent

GoodParent
ChildOfGoodParent
~ChildOfGoodParent
~GoodParent
GoodParent
ChildOfGoodParent
~ChildOfGoodParent
~GoodParent</pre>
   </details>

   <details>
      <summary>Explanation</summary>
      <a>Not implemented</a>
   </details>
</details>
<br>

### 5. Incest в С++?
```c++
namespace BadFamily {
struct Grandparent {
   Grandparent() {std::cout << "Grandparent\n";}
};

struct Mother : Grandparent {
   Mother() {std::cout << "Mother\n";}
};

struct Father : Grandparent {
   Father() {std::cout << "Father\n";}
};

struct Child : Mother, Father {
   Child() {std::cout << "Child\n";}
};
}

namespace GoodFamily {
struct Grandparent {
   Grandparent() {std::cout << "Grandparent\n";}
};

struct Mother : virtual Grandparent {
   Mother() {std::cout << "Mother\n";}
};

struct Father : virtual Grandparent {
   Father() {std::cout << "Father\n";}
};

struct Child : Mother, Father {
   Child() {std::cout << "Child\n";}
};
}

int main()
{
   {
       BadFamily::Child child;
   }
   std::cout <<'\n';
   {
       GoodFamily::Child child;
   }
   /* What will be the output and why? */
}
```
<details>
  <summary>Answer:</summary>

   <details>
     <summary>Output:</summary>
     <pre>Grandparent
Mother
Grandparent
Father
Child

Grandparent
Mother
Father
Child</pre>
   </details>

   <details>
      <summary>Explanation</summary>
      <a>Not implemented</a>
   </details>
</details>
<br>

1. Simple inheritance
1.1 How actually methods are called (passing this)
1.2 How virtual methods are called (changing the address in vtable)
1.3 Fields of virtual class instance (vtable)
1.4 Fields of virtual with inheritance and inheritance 
1.5 vtable, typeinfo, graphically show dependencies
2. Multiple inheritance
2.1 Non-virtual thunk
2.2 Layout of several base classes
3. Diamond problem
3.1 Example with common inheritance and what it looks like
3.2 Example on how to solve it
4. Virtual inheritance
4.1 Construction vtable
5. Questions/puzzles regarding inheritance
5.1 Take out all inheritance questions from general questions
5.2 Take out questions from PortaOne