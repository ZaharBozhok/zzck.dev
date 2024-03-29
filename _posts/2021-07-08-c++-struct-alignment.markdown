---
layout: post
title:  "Data alignment in C/C++"
date:   2021-08-08
last_modified_at: 2021-08-10
categories: [C++]
tags: [C++,Data alignment]
---

<details>
  <summary>Environment</summary>
  <ul>
    <li>OS: macOS Big Sur 11.4</li>
    <li>CPU: Apple M1</li>
    <li>Compiler: Apple clang version 12.0.5 (clang-1205.0.22.11)</li>
    <li>Target: arm64-apple-darwin20.5.0</li>
  </ul>
</details>
<br>

### Problem:
```c++
struct A {
    uint8_t data8;
    uint64_t data64;
    uint32_t data32;
};
/* What's the difference and why? */
struct B {
    uint64_t data64;
    uint32_t data32;
    uint8_t data8;
};
```
<br>

Difference between these structures is in data alignment which depends mostly on your compiler configuration. <br><br>
[Example](https://github.com/ZaharBozhok/cpp_learning/blob/master/src/ClassPaddingAndSize.cpp) (and [header](https://github.com/ZaharBozhok/cpp_learning/blob/master/src/utils.h)) how to conveniently check similar structs for education purpose<br>
(Example uses tuples to make code smaller)
<br><br>

Consider following code (it uses function from the link above):<br>
```c++
printTupleInfo(std::tuple<uint8_t, uint64_t, uint32_t>());
printTupleInfo(std::tuple<uint64_t, uint32_t, uint8_t>());
```
<br>

The output of the code above:
```c++
[T = std::__1::tuple<unsigned char, unsigned long long, unsigned int>]
   sizeof = 24
   alignment_of = 8
   [t = unsigned char]
      sizeof = 1
      value = 0
   [t = unsigned long long]
      sizeof = 8
      value = 0
   [t = unsigned int]
      sizeof = 4
      value = 0

[T = std::__1::tuple<unsigned long long, unsigned int, unsigned char>]
   sizeof = 16
   alignment_of = 8
   [t = unsigned long long]
      sizeof = 8
      value = 0
   [t = unsigned int]
      sizeof = 4
      value = 0
   [t = unsigned char]
      sizeof = 1
      value = 0
```
<br>

Despite that structures have exactly the same amount and types of fields the sizes of the structs are different.<br><br><br>

**What's going on?**<br><br>
Short answer is because CPUs are word oriented (not byte oriented).<br>
<details>
  <summary>Long answer</summary>

  On the 64-bit CPU sizeof(word) will be 8 bytes and for 32-bit is 4 bytes accordingly, so accessing aligned data is simply saying more optimized (more on this here https://developer.ibm.com/technologies/systems/articles/pa-dalign/).<br>
  Data in structures is aligned to the data's size <br>(data_address % sizeof(data) == 0)<br> and depending on the order there can be different amount of pads. For example `char` should be aligned to 1, `wchar` should be aligned to 2, `float` should aligned to 4 and `long long` to 8. Alignment in array is explained further.<br>
</details>
<br>

<center><b>Alignment of a `struct A` object</b></center>
![Layout of a struct A object](/assets/images/2021-07-08-c++-struct-alignment/struct_A.png)
<br>
Hence `long long` should be aligned to a multiple of 8 we get a 7 byte pad before it. Second pad is inserted in order not to loose alignment when used in array. For example the `long long` field should be aligned to a multiple of 8 and without second pad second element in array won't have a `long long` field aligned to a multiple of 8.
<br><br>

<center><b>Alignment of an array of `struct A` objects</b></center>
![Layout of an array of struct A objects](/assets/images/2021-07-08-c++-struct-alignment/struct_A_arr.png)
<br>
Thanks to padding `long long` haven't lost its alignment.<br><br><br>

<center><b>Alignment of a `struct B` object</b></center>
![Layout of a struct A object](/assets/images/2021-07-08-c++-struct-alignment/struct_B.png)
This is the same object, but due to alignment it will weight less than `struct A` object. So different fields order will result to different memory object representation. This can lead to unobvious errors. For example to be as fast as possible you send a struct as a piece of memory over the network (ignore Endian problems 😄) and after a while occasionally (or intentionally) you change the order of fields and get corrupted values because now mapping is broken.
<br><br>
<center><b>Alignment of an array of `struct B` objects</b></center>
![Layout of an array of struct A objects](/assets/images/2021-07-08-c++-struct-alignment/struct_B_arr.png)
<br>
So in this particular case 3 objects of `struct B` fits to 48 bytes, while only 2 objects of `struct A` fits to the same 48 bytes. Quite good optimization for a large amount of objects.<br>

As a rule of thumb place fields in decreasing order to get rid of extra padding.<br>

You can force your compiler not to align data, but then the processor will have to perform more instructions to access not aligned fields (by combining first part from first word and second part from the second word).<br><br>
**P.S.** If you want to get an alignment of your structure here is an example:
```c++
    class Test
    {
        int a;
        char b;
    };
    /* C++11 way */
    std::cout << "Alignment of [T = Test] : " << std::alignment_of<Test>::value << '\n';
    /* C++17 way */
    std::cout << "Alignment of [T = Test] : " << std::alignment_of_v<Test> << '\n';
    /* alignof way, but can't be used in templates */
    std::cout << "Alignment of [T = Test] : " << alignof(test) << '\n';

```
<br>

#### TODO
- Perform perf tests on accessing aligned/unaligned data
- Checkout [alignas](https://en.cppreference.com/w/cpp/language/alignas)
- Checkout [std::aligned_storage](https://en.cppreference.com/w/cpp/types/aligned_storage)
- Checkout [std::aligned_alloc](https://en.cppreference.com/w/cpp/memory/c/aligned_alloc)
- Checkout [std::aligned_union](https://en.cppreference.com/w/cpp/types/aligned_union)
- Checkout [std::max_align_t](https://en.cppreference.com/w/cpp/types/max_align_t)
- Checkout [compiler specific align operations](https://stackoverflow.com/questions/14332633/attribute-packed-v-s-gcc-attribute-alignedx)
- Checkout [assume_aligned](https://en.cppreference.com/w/cpp/memory/assume_aligned)
- Checkout [std::align](https://en.cppreference.com/w/cpp/memory/align)
- Checkout [std::launder](https://habr.com/ru/post/540954/)
<br><br>

#### References
- [CPU and Data alignment][ref1] 
- [Structure Member Alignment, Padding and Data packing][ref2]
- [Struct padding in c][ref3]
- [Расставим точки над структурами С/С++][ref4]
- [Alignment exception][ref5]
- [IBM Article about padding and alignment][ref6]
- [alignof vs alignment_of_v][ref7]

[jekyll-paper-docs]: https://github.com/ghosind/Jekyll-Paper/wiki
[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-paper-issues]: https://github.com/ghosind/Jekyll-Paper/issues
[jekyll-talk]: https://talk.jekyllrb.com/

[ref1]: https://stackoverflow.com/questions/3025125/cpu-and-data-alignment
[ref2]: https://www.geeksforgeeks.org/structure-member-alignment-padding-and-data-packing/
[ref3]: https://stackoverflow.com/questions/5397447/struct-padding-in-c
[ref4]: https://habr.com/ru/post/142662/
[ref5]: https://stackoverflow.com/questions/59076652/why-is-an-alignment-exception-thrown-when-accessing-an-unaligned-uint16-array
[ref6]: https://developer.ibm.com/technologies/systems/articles/pa-dalign/
[ref7]: https://stackoverflow.com/questions/36981968/stdalignment-of-versus-alignof
